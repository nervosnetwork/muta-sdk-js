// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import { GraphQLClient } from 'graphql-request';
import randomBytes from 'random-bytes';
import { DEFAULT_TIMEOUT_GAP } from '../core/constant';
import { toHex } from '../utils';
import { getSdk, InputRawTransaction } from './codegen/sdk';
import { Retry } from './retry';

interface CallService<Pld> {
  timeout?: string;
  serviceName: string;
  method: string;
  payload: Pld;
}

/**
 * Client for call Muta GraphQL API
 */
export class Client {
  private readonly rawClient: ReturnType<typeof getSdk>;

  /**
   * GraphQL endpoint, ie. htto://127.0.0.1:8000/graphql
   */
  private readonly endpoint;
  /**
   * the ChainID
   */
  private readonly chainId;

  constructor(entry: string, chainId: string) {
    this.endpoint = entry;
    this.chainId = chainId;

    this.rawClient = getSdk(
      new GraphQLClient(this.endpoint, {
        cache: 'no-cache'
      })
    );
  }

  /**
   * get epoch id(or epoch height as a hex string)
   */
  public async getLatestEpochId(): Promise<string> {
    const res = await this.rawClient.getEpochId();
    return res.getEpoch.header.epochId;
  }

  public async getEpochHeight(): Promise<number> {
    const epochId = await this.getLatestEpochId();
    return Number('0x' + epochId);
  }

  public async prepareTransaction<Pld>(
    tx: CallService<Pld>
  ): Promise<InputRawTransaction> {
    const timeout = await (tx.timeout
      ? Promise.resolve(tx.timeout)
      : toHex((await this.getEpochHeight()) + DEFAULT_TIMEOUT_GAP - 1));

    return {
      chainId: this.chainId,
      // TODO change cyclesLimit by last epoch
      cyclesLimit: '0x9999',
      // TODO change cyclesLimit by last epoch
      cyclesPrice: '0x9999',
      nonce: toHex(randomBytes.sync(32).toString('hex')),
      timeout,
      ...tx,
      payload: JSON.stringify(tx.payload)
    };
  }

  /**
   * sendTransaction
   * @param signedTransaction
   */
  public async sendTransaction<R>(
    signedTransaction: SignedTransaction<R>
  ): Promise<string> {
    const inputRaw = signedTransaction.inputRaw;

    const rawPayload = inputRaw.payload;
    const payload =
      typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload);

    const res = await this.rawClient.sendTransaction({
      inputEncryption: signedTransaction.inputEncryption,
      inputRaw: { ...inputRaw, payload }
    });

    return res.sendTransaction;
  }

  public async queryService<Ret, Pld extends string | object>(
    variables: ServicePayload<Pld>
  ): Promise<{
    isError: boolean;
    ret: Ret;
  }> {
    const payload: string =
      typeof variables.payload !== 'string'
        ? JSON.stringify(variables.payload)
        : variables.payload;

    const parsedPayload = { ...variables, payload };
    const res = await this.rawClient.queryService(parsedPayload);

    return {
      isError: res.queryService.isError,
      ret: JSON.parse(res.queryService.ret) as Ret
    };
  }

  public async getReceipt(txHash) {
    const res = await Retry.from(() =>
      this.rawClient.getReceipt({ txHash })
    ).start();

    return res.getReceipt.response.ret;
  }

  /**
   * wait for next _n_ epoch
   * @example
   * ```typescript
   * async main() {
   *   const before =  await client.getEpochHeight();
   *   await client.waitForNextNEpoch(2);
   *   const after =  await client.getEpochHeight();
   *   console.log(after - before)
   * }
   * ```
   * @param n epoch count
   */
  public async waitForNextNEpoch(n: number) {
    const before = await this.getEpochHeight();
    return Retry.from(() => this.getEpochHeight())
      .withCheck(height => height - before >= n)
      .withInternal(1000)
      .withTimeout((n + 1) * 3000)
      .start();
  }
}
