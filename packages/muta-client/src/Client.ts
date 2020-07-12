import {
  getSdk,
  InputRawTransaction,
  InputTransactionEncryption,
} from '@mutadev/client-raw';
import { invariant } from '@mutadev/shared';
import {
  Address,
  Any,
  Block,
  Hash,
  Maybe,
  QueryServiceParam,
  Receipt,
  ServicePayload,
  ServiceResponse,
  SignedTransaction,
  Transaction,
  Uint64,
} from '@mutadev/types';
import {
  hexToNum,
  randomNonce,
  safeParseJSON,
  safeStringifyJSON,
  toHex,
} from '@mutadev/utils';
import { GraphQLClient } from 'graphql-request';
import { defaults, isNil } from 'lodash';
import { ClientOption, getDefaultClientOption } from './options';
import { retry, RetryConfig } from './retry';

export type DynPayload = string | Record<string, unknown>;

/**
 * give those params,
 * the client will [[composeTransaction]] with default info in [[ClientOption]] for you
 */
export interface ComposeTransactionParam<P> {
  cyclesPrice?: Uint64;
  cyclesLimit?: Uint64;
  timeout?: Uint64;
  serviceName: string;
  method: string;
  payload: P;
  sender: Address;
}

type RawClient = ReturnType<typeof getSdk>;

interface GetBlock {
  (): Promise<Block>;

  (height: Uint64): Promise<Maybe<Block>>;
}

/**
 * Client is a tool for calling Muta GraphQL API
 * shortly, it implements js code for you to send raw **GraphQL** rpc to node and do some prepare job **locally**.
 * you can [[getBlock]] infos, {@link queryServiceDyn} [[sendTransaction]] and [[getReceipt]] to node,
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
   * @param options, see {@link ClientOption} for more details
   */
  constructor(options?: Partial<ClientOption>) {
    this.options = defaults(options, getDefaultClientOption());

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
   * get a {@link Block} or get the latest {@link Block}
   * @param height the target height, or empty for the latest block
   */
  getBlock: GetBlock = (async (height?: Uint64): Promise<Maybe<Block>> => {
    const heightVariable = !isNil(height) ? { height } : undefined;
    const res = await this.rawClient.getBlock(heightVariable);

    return res.getBlock ?? null;
  }) as GetBlock;

  /**
   * get latest block height
   * @return the latest block height
   */
  public async getLatestBlockHeight(): Promise<number> {
    const block = await this.getBlock();
    return hexToNum(block!.header.height);
  }

  /**
   * get [[SignedTransaction]] by give its transaction hash
   * @param txHash the transaction target hash, you can call [[sendTransaction]] to send a tx and get its txHash
   */
  public async getTransaction(txHash: Hash): Promise<Maybe<SignedTransaction>> {
    const timeout = this.options.maxTimeout;
    const res = await retry({
      retry: () => this.rawClient.getTransaction({ txHash }),
      timeout,
    });
    return res.getTransaction ?? null;
  }

  /**
   * get [[Receipt]] by give its transaction hash
   * you can only get a [[Receipt]] when the related [[Transaction]] has been committed/mined
   * @param txHash the target transaction hash, you can call [[sendTransaction]] to send a [[Transaction]] and get its txHash
   */
  public async getReceipt(txHash: Hash): Promise<Maybe<Receipt>> {
    const res = await this.rawClient.getReceipt({ txHash });

    return res.getReceipt ?? null;
  }

  /**
   * In Muta, there are 2 kinds of call to the chain,
   * one is [[queryService]], that's for getting info from chain but committing **NO MODIFICATION**,
   * another is [[sendTransaction]]
   * it somehow like eth_call in Ethereum
   * @param param
   * @return
   */
  public async queryService(
    param: QueryServiceParam,
  ): Promise<ServiceResponse> {
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
  public async queryServiceDyn<P, R>(
    param: ServicePayload<P>,
  ): Promise<ServiceResponse<R>> {
    const payload: string =
      typeof param.payload !== 'string'
        ? safeStringifyJSON(param.payload)
        : param.payload;

    const queryServiceQueryParam: QueryServiceParam = { ...param, payload };
    const res = await this.rawClient.queryService(queryServiceQueryParam);

    const errorMessage = res.queryService.errorMessage;
    invariant(!errorMessage, `RPC error: ${res.queryService.errorMessage}`);

    return {
      ...res.queryService,
      succeedData: safeParseJSON(res.queryService.succeedData) as R,
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
      sender: signedTransaction.sender,
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
  public async composeTransaction<P extends string | Any>(
    param: ComposeTransactionParam<P>,
  ): Promise<Transaction> {
    const {
      timeoutGap,
      chainId,
      defaultCyclesLimit,
      defaultCyclesPrice,
    } = this.options;

    const payload: string =
      typeof param.payload !== 'string'
        ? safeStringifyJSON(param.payload)
        : param.payload;

    const timeout = param.timeout
      ? param.timeout
      : toHex((await this.getLatestBlockHeight()) + timeoutGap - 1);

    const sender = param.sender;

    return {
      chainId,
      cyclesLimit: defaultCyclesLimit,
      cyclesPrice: defaultCyclesPrice,
      nonce: randomNonce(),
      timeout,
      ...param,
      payload,
      sender,
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
   * @param options
   */
  async waitForNextNBlock(n = 1, options: RetryConfig = {}): Promise<number> {
    const before = await this.getLatestBlockHeight();

    return retry({
      onResolve: (height) => height - before >= n,
      retry: () => this.getLatestBlockHeight(),
      timeout: this.options.maxTimeout,
      ...options,
    });
  }
}
