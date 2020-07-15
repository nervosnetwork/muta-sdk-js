import { getSdk } from '@mutadev/client-raw';
import {
  Block,
  Hash,
  Maybe,
  Receipt,
  ServiceResponse,
  SignedTransaction,
  Transaction,
  Uint64,
} from '@mutadev/types';
import {
  hexToNum,
  isSignedTransaction,
  randomNonce,
  separateOutEncryption,
  separateOutRawTransaction,
  toHex,
} from '@mutadev/utils';
import { GraphQLClient } from 'graphql-request';
import { defaults, isNil } from 'lodash';
import { ClientOption, getDefaultClientOption } from './options';
import { retry, RetryConfig } from './retry';
import { ComposeTransactionParam, QueryServiceParam } from './types';

type RawClient = ReturnType<typeof getSdk>;

interface GetBlock {
  (): Promise<Block>;

  (height: Uint64): Promise<Maybe<Block>>;
}

/**
 * Client is a tool for calling Muta GraphQL API
 * shortly, it implements js code for you to send raw **GraphQL** RPC to node
 * and do some prepare job **locally**.
 */
export class Client {
  private readonly rawClient: RawClient;

  private readonly options: ClientOption;

  /**
   * construct a Client by given {@link ClientOption}
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
   * @internal
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
   * get {@link SignedTransaction} by give its transaction hash
   * @param txHash the transaction target hash, you can call {@link sendTransaction} to send a tx and get its txHash
   */
  public async getTransaction(txHash: Hash): Promise<Maybe<SignedTransaction>> {
    const res = await this.rawClient.getTransaction({ txHash });
    return res.getTransaction ?? null;
  }

  /**
   * get {@link Receipt} by give its transaction hash
   * you can only get a {@link Receipt} when the related {@link Transaction} has been committed/mined
   *
   * @param txHash the target transaction hash, call {@link sendTransaction} to send a {@link Transaction} and get its txHash
   */
  public async getReceipt(txHash: Hash): Promise<Maybe<Receipt>> {
    const res = await this.rawClient.getReceipt({ txHash });

    return res.getReceipt ?? null;
  }

  /**
   * In Muta, there are 2 kinds of call to the chain,
   * one is {@link queryService}, that's for getting info from chain but committing **NO MODIFICATION**,
   * another is {@link sendTransaction}
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
   * In Muta, there are 2 kinds of call to the chain,
   * one is {@link sendTransaction}, that's for sending transactions to communicate with chain, the transaction may or may not modify the state of chain
   * another is {@link queryService}
   * @param tx
   * @return
   */
  public async sendTransaction(
    tx: SignedTransaction | Transaction,
  ): Promise<Hash> {
    let signedTx: SignedTransaction;

    if (isSignedTransaction(tx)) {
      signedTx = tx;
    } else if (this.options.account) {
      signedTx = this.options.account.signTransaction(tx);
    } else {
      throw new Error(
        'sendTransaction allows only signed transaction or ' +
          'Client constructed with an account like ' +
          '  `new Client({ account: ... })` ',
      );
    }

    const res = await this.rawClient.sendTransaction({
      inputEncryption: separateOutEncryption(signedTx),
      inputRaw: separateOutRawTransaction(signedTx),
    });
    return res.sendTransaction;
  }

  /**
   * easy tool for compose a {@link Transaction} stuffed with preset {@link ClientOption}
   * @typeparam P generic of object which will be JSON.stringify to payload string in {@link Transaction}
   * @param param your params
   */
  public async composeTransaction<P = unknown>(
    param: ComposeTransactionParam<P>,
  ): Promise<Transaction> {
    const {
      timeoutGap,
      chainId,
      defaultCyclesLimit,
      defaultCyclesPrice,
    } = this.options;

    const payload = this.options.serializer.serialize(param.payload);

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
