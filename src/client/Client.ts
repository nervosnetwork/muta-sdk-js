// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import { GraphQLClient } from 'graphql-request';
import randomBytes from 'random-bytes';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP,
} from '../constant/constant';
import { boom } from '../error';
import {
  Block,
  ExecResp,
  ExecRespDyn,
  Hash,
  Maybe,
  QueryBlockParam,
  QueryServiceParam,
  Receipt,
  ServicePayload,
  SignedTransaction,
  Transaction,
} from '../type';
import { hexToNum, safeParseJSON, safeStringifyJSON, toHex } from '../utils';
import {
  getSdk,
  InputRawTransaction,
  InputTransactionEncryption,
} from './codegen/sdk';
import { Retry } from './retry';

/**
 * give those params,
 * the client will [[composeTransaction]] with default info in [[ClientOption]] for you
 */
export interface ComposeTransactionParam<P> {
  timeout?: string;
  serviceName: string;
  method: string;
  payload: P;
}

/**
 * the preset [[ClientOption]] when you construct [[Client]]
 * you may manually construct by Construct
 * or from Muta's [[client]]
 */
export interface ClientOption {
  endpoint: string;
  chainId: string;
  maxTimeout: number;
  defaultCyclesLimit: Uint64;
  defaultCyclesPrice: Uint64;
}

type RawClient = ReturnType<typeof getSdk>;

/**
 * Client is a tool for calling Muta GraphQL API
 * shortly, it implements js code for you to send raw **GrapghQL** rpc to node and do some prepare job **locally**.
 * you can [[getBlock]] infos, [[queryServiceDyn]], [[sendTransaction]] and [[getReceipt]] to node,
 * more, you can [[composeTransaction]] locally, please see more function details,
 *
 * The Muta GraphQL API consists of 2 kinds and the concept is corresponding to GraphQL.
 * thus Muta GraphQL API has 2 types, Query and Mutation, as normal as in GraphQL.
 * 1. Query just retrieves data and makes call without side-effect to the Muta chain, which means no modification should happen. Like eth_call in json_rpc of Ethereum
 * 2. Mutation can trigger the logic and modify the state of Muta chain. Like eth_sendTransaction in json_rpc of Ethereum
 *
 * Currently:
 *
 * **Query**
 * 1. [[getBlock]], [[getLatestBlockHeight]] and [[[waitForNextNBlock]]
 * 2. [[getTransaction]]
 * 3. [[getReceipt]]
 * 4. [[queryService]] and [[queryServiceDyn]]
 *
 * **Mutation**
 * 1. [[sendTransaction]]
 *
 * **Locally**
 * 1. [[composeTransaction]]
 *
 * Please check [[AssetService]] 's source code to get the usage of this Client.
 */
export class Client {
  private readonly rawClient: RawClient;

  private readonly options: ClientOption;

  /**
   * construct a Client by given [[ClientOption]]
   * @param options, see [[ClientOption]] for more details
   */
  constructor(options: ClientOption) {
    this.options = options;

    this.rawClient = getSdk(
      new GraphQLClient(this.options.endpoint, {
        cache: 'no-cache',
      }),
    );
  }

  /**
   * @hidden
   */
  public getRawClient(): RawClient {
    return this.rawClient;
  }

  /**
   * get the [[Block]] of given height
   * @param height the target height you want search, null for the latest
   */
  public async getBlock(height?: Maybe<string>): Promise<Block> {
    const queryBlockParam: QueryBlockParam = { height };
    const res = await this.rawClient.getBlock(queryBlockParam);
    return res.getBlock as Block;
  }

  /**
   * get latest block height
   * @return the latest block height
   */
  public async getLatestBlockHeight(): Promise<number> {
    const block = await this.getBlock(null);
    return hexToNum(block.header.height);
  }

  /**
   * get [[SignedTransaction]] by give its transaction hash
   * @param txHash the transaction target hash, you can call [[sendTransaction]] to send a tx and get its txHash
   */
  public async getTransaction(txHash: Hash): Promise<SignedTransaction> {
    const timeout = Math.max(
      this.options.maxTimeout,
      (DEFAULT_TIMEOUT_GAP + 1) * DEFAULT_CONSENSUS_INTERVAL,
    );
    const res = await Retry.from(() =>
      this.rawClient.getTransaction({ txHash }),
    )
      .withTimeout(timeout)
      .start();

    return res.getTransaction;
  }

  /**
   * get [[Receipt]] by give its transaction hash
   * you can only get a [[Receipt]] when the related [[Transaction]] has been committed/mined
   * @param txHash the target transaction hash, you can call [[sendTransaction]] to send a [[Transaction]] and get its txHash
   */
  public async getReceipt(txHash: Hash): Promise<Receipt> {
    const timeout = Math.max(
      this.options.maxTimeout,
      (DEFAULT_TIMEOUT_GAP + 1) * DEFAULT_CONSENSUS_INTERVAL,
    );
    const res = await Retry.from(() => this.rawClient.getReceipt({ txHash }))
      .withTimeout(timeout)
      .start();

    return res.getReceipt;
  }

  /**
   * In Muta, there are 2 kinds of call to the chain,
   * one is [[queryService]], that's for getting info from chain but committing **NO MODIFICATION**,
   * another is [[sendTransaction]]
   * it somehow like eth_call in Ethereum
   * @param param
   * @return
   */
  public async queryService(param: QueryServiceParam): Promise<ExecResp> {
    const res = await this.rawClient.queryService(param);

    return res.queryService;
  }

  /**
   * like [[queryService]], but with generic, which means if you give object param and generic type,
   * it will auto encode and decode data for you,
   * the encode and decode method is JSON.stringfy and JSON.parse
   * @typeparam P the payload object which will be (tried to )encoded by JSON.stringfy
   * @typeparam R the return object which will be decoded by JSON.parse
   * @param param
   * @return
   */
  public async queryServiceDyn<P extends string | object, R extends object>(
    param: ServicePayload<P>,
  ): Promise<ExecRespDyn<R>> {
    const payload: string =
      typeof param.payload !== 'string'
        ? safeStringifyJSON(param.payload)
        : param.payload;

    const queryServiceQueryParam: QueryServiceParam = { ...param, payload };
    const res = await this.rawClient.queryService(queryServiceQueryParam);

    const isError = res.queryService.isError;
    if (isError) {
      throw boom(`RPC error: ${res.queryService.ret}`);
    }

    return {
      isError,
      ret: safeParseJSON(res.queryService.ret) as R,
    };
  }

  /**
   * In Muta, there are 2 kinds of call to the chain,
   * one is [[sendTransaction]], that's for sending transactions to communicate with chain, the transaction may or may not modify the state of chain
   * another is [[queryService]]
   * @param signedTransaction
   * @return
   */
  public async sendTransaction(
    signedTransaction: SignedTransaction,
  ): Promise<Hash> {
    const inputRaw: InputRawTransaction = {
      chainId: signedTransaction.chainId,
      cyclesLimit: signedTransaction.cyclesLimit,
      cyclesPrice: signedTransaction.cyclesPrice,
      method: signedTransaction.method,
      nonce: signedTransaction.nonce,
      payload: signedTransaction.payload,
      serviceName: signedTransaction.serviceName,
      timeout: signedTransaction.timeout,
    };

    const inputEncryption: InputTransactionEncryption = {
      pubkey: signedTransaction.pubkey,
      signature: signedTransaction.signature,
      txHash: signedTransaction.txHash,
    };

    const res = await this.rawClient.sendTransaction({
      inputEncryption,
      inputRaw,
    });

    return res.sendTransaction;
  }

  /**
   * easy tool for compose a [[Transaction]] stuffed with preset [[ClientOption]]
   * @typeparam P generic of object which will be JSON.stringify to payload string in [[Transaction]]
   * @param param your params
   */
  public async composeTransaction<P extends string | object>(
    param: ComposeTransactionParam<P>,
  ): Promise<Transaction> {
    const payload: string =
      typeof param.payload !== 'string'
        ? safeStringifyJSON(param.payload)
        : param.payload;

    const timeout = param.timeout
      ? param.timeout
      : toHex((await this.getLatestBlockHeight()) + DEFAULT_TIMEOUT_GAP - 1);

    return {
      chainId: this.options.chainId,
      cyclesLimit: this.options.defaultCyclesLimit,
      cyclesPrice: this.options.defaultCyclesPrice,
      nonce: toHex(randomBytes.sync(32).toString('hex')),
      timeout,
      ...param,
      payload,
    };
  }

  /**
   * wait for next _n_ block
   * @example
   * ```typescript
   * async main() {
   *   const before =  await client.getLatestBlockHeight();
   *   await client.waitForNextNBlock(2);
   *   const after =  await client.getLatestBlockHeight();
   *   console.log(after - before);
   * }
   * ```
   * @param n block count
   */
  public async waitForNextNBlock(n: number) {
    const before = await this.getLatestBlockHeight();
    const timeout = Math.max(
      (n + 1) * DEFAULT_CONSENSUS_INTERVAL,
      this.options.maxTimeout,
    );
    return Retry.from(() => this.getLatestBlockHeight())
      .withCheck(height => height - before >= n)
      .withInterval(1000)
      .withTimeout(timeout)
      .start();
  }
}
