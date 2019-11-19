import {
  DefaultOptions,
  DocumentNode,
  HttpLink,
  InMemoryCache
} from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import gql from 'graphql-tag';
import randomBytes from 'random-bytes';
import { Required } from 'utility-types';
import { DEFAULT_TIMEOUT_GAP } from '../core/constant';
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

  private readonly client: ApolloClient<any>;

  constructor(entry: string, chainId: string) {
    this.endpoint = entry;
    this.chainId = chainId;

    const link = new HttpLink({
      fetchOptions: {
        mode: 'no-cors'
      },
      uri: this.endpoint
    });

    // create ApolloClient without cache
    const defaultOptions: DefaultOptions = {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      },
      watchQuery: {
        errorPolicy: 'ignore',
        fetchPolicy: 'no-cache'
      }
    };
    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions,
      link
    });
  }

  /**
   * get epoch id(or epoch height as a hex string)
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

  /**
   *
   * @param address
   * @param assetId Identifier of asset in Muta. ie.
   */
  public getBalance(address: string, assetId: string): Promise<number> {
    return this.query(
      gql`{ getBalance(address: "${address}", id: "${assetId}") }`
    ).then(res => Number('0x' + res.data.getBalance));
  }

  /**
   * A transaction often takes a lot of message like nonce, block height,
   * timeout and so on. This function helps you to assemble a transaction quickly
   * with some commonly used parameters.
   * @param options
   */
  public async prepareTransferTransaction(
    options: Required<
      Partial<TransferTransaction>,
      'carryingAmount' | 'carryingAssetId' | 'receiver'
    >
  ): Promise<TransferTransaction> {
    const nonce = toHex(randomBytes.sync(32).toString('hex'));
    const height = await this.getEpochHeight();
    const timeout = toHex(height + DEFAULT_TIMEOUT_GAP - 1);

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

  /**
   * Return a transaction hash after sentTransferTransaction
   */
  public async sendTransferTransaction(
    options: SignedTransferTransaction
  ): Promise<string> {
    const res = await this.mutation(gql`mutation {
      sendTransferTransaction(
        inputRaw: {
          chainId: "${options.chainId}",
          feeCycle: "${options.feeCycle}",
          feeAssetId: "${options.feeAssetId}",
          nonce: "${options.nonce}",
          timeout: "${options.timeout}"
        },
        inputAction: {
          carryingAmount: "${options.carryingAmount}",
          carryingAssetId: "${options.carryingAssetId}",
          receiver: "${options.receiver}",
        },
        inputEncryption: {
          txHash: "${options.txHash}",
          pubkey: "${options.pubkey}",
          signature: "${options.signature}"
        }
      )}`);
    return res?.data?.sendTransferTransaction;
  }

  public query(query: DocumentNode) {
    return this.client.query({ query });
  }

  public mutation(mutation: DocumentNode) {
    return this.client.mutate({ mutation });
  }
}
