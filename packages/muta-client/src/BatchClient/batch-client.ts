import { GetReceiptQuery, GetTransactionQuery } from '@mutadev/client-raw';
import { Hash } from '@mutadev/types';
import { defaults } from 'lodash';
import { DeepPartial } from 'utility-types';
import { ClientOption, getDefaultClientOption } from '../options';
import { chunkAndBatch } from './batch';

type RawTransaction = Omit<GetTransactionQuery['getTransaction'], '__typename'>;
type RawReceipt = Omit<GetReceiptQuery['getReceipt'], '__typename'>;

/**
 * ```
 * _${index}: getTransaction(txHash: "${txHash}") {
 *    ...transactionKeys
 *  }
 * ```
 * @param txHash
 * @param index
 */
const generateTransactionQuerySegment = (txHash: string, index: number) => `
_${index}: getTransaction(txHash: "${txHash}") {
  ...transactionKeys
}
`;

/**
 * a GraphQL fragment for transaction keys
 * ```graphql
 * fragment transactionKeys on SignedTransaction {
 *    chainId
 *    cyclesLimit
 *    cyclesPrice
 *    method
 *    nonce
 *    payload
 *    pubkey
 *    serviceName
 *    signature
 *    timeout
 *    txHash
 * }
 * ```
 */
export const txFragment = /*GraphQL*/ `
fragment transactionKeys on SignedTransaction {
    chainId
    cyclesLimit
    cyclesPrice
    method
    nonce
    payload
    pubkey
    serviceName
    signature
    timeout
    txHash
    sender
}
`;

const generateReceiptQuerySegment = (txHash: string, index: number) => `
_${index}: getReceipt(txHash: "${txHash}") {
  ...receiptKeys
}
`;
const receiptFragment = `
fragment receiptKeys on Receipt {
    txHash
    height
    cyclesUsed
    events {
      data
      service
    }
    stateRoot
    response {
      serviceName
      method
      response {
        code
        errorMessage
        succeedData
    }
  }
}
`;

interface BatchClientOption {
  client: ClientOption;
  batch: {
    concurrency: number;
    chunkSize: number;
  };
}

export class BatchClient {
  private options: BatchClientOption;

  constructor(options?: DeepPartial<BatchClientOption>) {
    this.options = defaults<
      DeepPartial<BatchClientOption> | undefined,
      BatchClientOption
    >(options, {
      client: getDefaultClientOption(),
      batch: {
        chunkSize: 200,
        concurrency: 20,
      },
    });
  }

  async getTransactions(txHashes: Hash[]): Promise<RawTransaction[]> {
    const { chunkSize, concurrency } = this.options.batch;
    const endpoint = this.options.client.endpoint;

    const batched = await chunkAndBatch<RawTransaction>({
      chunkSize,
      concurrency,
      endpoint,
      taskSource: txHashes,
      fragment: txFragment,
      generateQuerySegment: generateTransactionQuerySegment,
    });

    return Array.from({ length: txHashes.length }).map<RawTransaction>(
      (_, i) => batched['_' + i],
    );
  }

  async getReceipts(txHashes: Hash[]): Promise<RawReceipt[]> {
    const { chunkSize, concurrency } = this.options.batch;
    const endpoint = this.options.client.endpoint;

    const batched = await chunkAndBatch<RawReceipt>({
      chunkSize,
      concurrency,
      endpoint,
      taskSource: txHashes,
      fragment: receiptFragment,
      generateQuerySegment: generateReceiptQuerySegment,
    });

    return Array.from({ length: txHashes.length }).map<RawReceipt>(
      (_, i) => batched['_' + i],
    );
  }
}
