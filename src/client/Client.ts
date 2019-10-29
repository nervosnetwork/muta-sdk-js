import ApplloClient from 'apollo-boost';
// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import gql from 'graphql-tag';
import randomBytes from 'random-bytes';
import { toHex } from '../utils';

/**
 * Client for call Muta GraphQL API
 */
export class Client {
  /**
   * GraphQL endpoint, ie. htto://127.0.0.1:8000/graphql
   */
  private readonly endpoint;
  /**
   * the ChainID
   */
  private readonly chainId;

  private readonly client: ApplloClient<null>;

  constructor(entry: string, chainId: string) {
    this.endpoint = entry;
    this.chainId = chainId;

    this.client = new ApplloClient({
      uri: this.endpoint,
      // tslint:disable-next-line:object-literal-sort-keys
      fetchOptions: {
        fetchOptions: {
          mode: 'no-cors'
        }
      }
    });
  }

  public getEndPoint(): string {
    return this.endpoint;
  }

  /**
   * get epoch id(or height as a hex string)
   */
  public getLatestEpochId(): Promise<string> {
    return this.query(
      gql`
        {
          getLatestEpoch {
            header {
              epochId
            }
          }
        }
      `
    ).then(res => res.data.getLatestEpoch.header.epochId);
  }

  public async getEpochHeight(): Promise<number> {
    const epochId = await this.getLatestEpochId();
    return Number('0x' + epochId);
  }

  public getBalance(address: string, id: string): Promise<number> {
    return this.query(
      gql`{ getBalance(address: "${address}", id: "${id}") }`
    ).then(res => Number('0x' + res.data.getBalance));
  }

  public async createTransferTx(options: {
    carryingAmount;
    carryingAssetId;
    receiver;
    feeAssetId?;
    feeCycle?;
  }): Promise<TransferTx> {
    const nonce = toHex(randomBytes.sync(32).toString('hex'));
    const height = await this.getEpochHeight();
    const timeout = toHex(height + 29);

    return {
      chainId: this.chainId,
      nonce,
      timeout,

      carryingAmount: options.carryingAmount,
      carryingAssetId: options.carryingAssetId,
      receiver: options.receiver,

      feeAssetId: options.feeAssetId ?? options.carryingAssetId,
      feeCycle: options.feeCycle ?? '0xff'
    };
  }

  public sendTransferTransaction({
    nonce,
    timeout,
    feeCycle,
    feeAssetId,
    carryingAmount,
    carryingAssetId,
    receiver,
    inputEncryption
  }) {
    return this.mutation(gql`mutation {
      sendTransferTransaction(
        inputRaw: {
          chainId: "${this.chainId}",
          feeCycle: "${feeCycle}",
          feeAssetId: "${feeAssetId}",
          nonce: "${nonce}",
          timeout: "${timeout}"
        },
        inputAction: {
          carryingAmount: "${carryingAmount}",
          carryingAssetId: "${carryingAssetId}",
          receiver: "${receiver}",
        },
        inputEncryption: {
          txHash: "${inputEncryption.txHash}",
          pubkey: "${inputEncryption.pubkey}",
          signature: "${inputEncryption.signature}"
        }
      )}`);
  }

  private query(query) {
    return this.client.query<any>({ query });
  }

  private mutation(mutation) {
    return this.client.mutate({ mutation });
  }
}
