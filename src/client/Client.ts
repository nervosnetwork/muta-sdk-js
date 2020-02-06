// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import { GraphQLClient } from 'graphql-request';
import randomBytes from 'random-bytes';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP
} from '../constant/constant';
import {
  Block,
  ExecResp,
  ExecRespDyn,
  Hash,
  QueryBlockParam,
  QueryServiceQueryParam,
  Receipt,
  ServicePayload,
  SignedTransaction,
  Transaction
} from '../type';
import { hexToNum, toHex } from '../utils';
import {
  getSdk,
  InputRawTransaction,
  InputTransactionEncryption
} from './codegen/sdk';
import { Retry } from './retry';

interface CallService<Pld> {
  timeout?: string;
  serviceName: string;
  method: string;
  payload: Pld;
}

interface ClientOption {
  entry: string;
  chainId: string;
  maxTimeout: number;
}

type RawClient = ReturnType<typeof getSdk>;

/**
 * Client for call Muta GraphQL API
 */
export class Client {
  private readonly rawClient: RawClient;

  /**
   * GraphQL endpoint, ie. htto://127.0.0.1:8000/graphql
   */
  private readonly endpoint: string;
  /**
   * the ChainID
   */
  private readonly chainId: string;

  private readonly options: ClientOption;

  constructor(options: ClientOption) {
    this.endpoint = options.entry;
    this.chainId = options.chainId;

    this.options = options;

    this.rawClient = getSdk(
      new GraphQLClient(this.endpoint, {
        cache: 'no-cache'
      })
    );
  }

  public getRawClient(): RawClient {
    return this.rawClient;
  }

  public async getBlock(height: QueryBlockParam): Promise<Block> {
    const res = await this.rawClient.getBlock(height);
    return res.getBlock as Block;
  }

  /**
   * get latest block height
   */
  public async getLatestBlockHeight(): Promise<number> {
    const block = await this.getBlock({});
    return hexToNum(block.header.height);
  }

  public async getTransaction(txHash: Hash): Promise<SignedTransaction> {
    const timeout = Math.max(
      this.options.maxTimeout,
      (DEFAULT_TIMEOUT_GAP + 1) * DEFAULT_CONSENSUS_INTERVAL
    );
    const res = await Retry.from(() =>
      this.rawClient.getTransaction({ txHash })
    )
      .withTimeout(timeout)
      .start();

    return res.getTransaction;
  }

  public async getReceipt(txHash: Hash): Promise<Receipt> {
    const timeout = Math.max(
      this.options.maxTimeout,
      (DEFAULT_TIMEOUT_GAP + 1) * DEFAULT_CONSENSUS_INTERVAL
    );
    const res = await Retry.from(() => this.rawClient.getReceipt({ txHash }))
      .withTimeout(timeout)
      .start();

    return res.getReceipt;
  }

  public async queryService(param: QueryServiceQueryParam): Promise<ExecResp> {
    const res = await this.rawClient.queryService(param);

    // tslint:disable-next-line:no-object-literal-type-assertion
    return res.queryService;
  }

  public async queryServiceDyn<P extends string | object, R>(
    pld: ServicePayload<P>
  ): Promise<ExecRespDyn<R>> {
    const payload: string =
      typeof pld.payload !== 'string'
        ? JSON.stringify(pld.payload)
        : pld.payload;

    const queryServiceQueryParam: QueryServiceQueryParam = { ...pld, payload };
    const res = await this.rawClient.queryService(queryServiceQueryParam);

    return {
      isError: res.queryService.isError,
      ret: JSON.parse(res.queryService.ret) as R
    };
  }

  /**
   * sendTransaction
   * @param signedTransaction
   */
  public async sendTransaction(
    signedTransaction: SignedTransaction
  ): Promise<string> {
    const inputRaw: InputRawTransaction = {
      chainId: signedTransaction.chainId,
      cyclesLimit: signedTransaction.cyclesLimit,
      cyclesPrice: signedTransaction.cyclesPrice,
      method: signedTransaction.method,
      nonce: signedTransaction.nonce,
      payload: signedTransaction.payload,
      serviceName: signedTransaction.serviceName,
      timeout: signedTransaction.timeout
    };

    const inputEncryption: InputTransactionEncryption = {
      pubkey: signedTransaction.pubkey,
      signature: signedTransaction.signature,
      txHash: signedTransaction.txHash
    };

    const res = await this.rawClient.sendTransaction({
      inputEncryption,
      inputRaw
    });

    return res.sendTransaction;
  }

  /**
   * easy for use
   * @param tx
   */
  public async prepareTransaction<Pld>(
    tx: CallService<Pld>
  ): Promise<Transaction> {
    const timeout = await (tx.timeout
      ? Promise.resolve(tx.timeout)
      : toHex((await this.getLatestBlockHeight()) + DEFAULT_TIMEOUT_GAP - 1));

    return {
      chainId: this.chainId,
      // TODO change cyclesLimit by last block
      cyclesLimit: '0x9999',
      // TODO change cyclesLimit by last block
      cyclesPrice: '0x9999',
      nonce: toHex(randomBytes.sync(32).toString('hex')),
      timeout,
      ...tx,
      payload: JSON.stringify(tx.payload)
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
      this.options.maxTimeout
    );
    return Retry.from(() => this.getLatestBlockHeight())
      .withCheck(height => height - before >= n)
      .withInterval(1000)
      .withTimeout(timeout)
      .start();
  }
}
