import { Client } from '../client';
import { boom } from '../error';
import {
  QueryServiceParam,
  Receipt,
  SignedTransaction,
  Transaction,
} from '../type';
import * as utils from '../utils';

/**
 * Given an input payload, transform to [[QueryServiceParam]]
 */
type QueryServiceParamTransform<P = any> = (
  payload: P,
) => QueryServiceParam<P> | Promise<QueryServiceParam<P>>;

/**
 * Mark a service method for readonly, so the method of the service will only call queryService
 */
// @ts-ignore
export interface Read<P = any, R = any> {
  type: 'read';
  transform: QueryServiceParamTransform<P>;
}

/**
 * decorate read
 * @param transform
 */
export function read<P, R>(
  transform?: QueryServiceParamTransform<P>,
): Read<P, R> {
  return {
    transform,
    type: 'read',
  };
}

/**
 * check if a method is a read method
 * @param handler
 */
function isRead(handler: any): handler is Read {
  if (!('type' in handler) || !('handleParams' in handler)) {
    return false;
  }
  return handler.type === 'read';
}

type WritePayloadHandler<P = any> = (payload: P) => Promise<Transaction>;

/**
 *
 */
// @ts-ignore
interface WriteHandler<P = any, R = string> {
  (payload: P, privateKey: string | Buffer): Promise<SignedTransaction>;

  (payload: P): Promise<Transaction>;
}

/**
 * Write service with a JSON payload and return a receipt OR
 * composing a transaction when private key is not provided
 */
// @ts-ignore
export interface Write<P = any, R = string> {
  type: 'write';
  transform: WritePayloadHandler<P>;
}

/**
 * decorate write
 * @param transform
 */
export function write<P, R>(transform?: WritePayloadHandler<P>): Write<P, R> {
  return {
    transform,
    type: 'write',
  };
}

/**
 * check if it is a write decorator
 * @param handler
 */
function isWrite(handler: any): handler is Write {
  if (!('type' in handler) || !('handler' in handler)) {
    return false;
  }
  return handler.type === 'write';
}

interface SendTransaction<PW = any, RW = any> {
  (payload: PW): Promise<Transaction>;

  (payload: PW, privateKey: string): Promise<RW>;
}

interface BindingDeclaration<T> {
  serviceName: string;
  model: T;
  client: Client;
}

export type ServiceBinding<Binding> = {
  [method in keyof Binding]: Binding[method] extends Read<
    infer ReadPayload,
    infer QueryResponse
  >
    ? (payload: ReadPayload) => Promise<QueryResponse>
    : Binding[method] extends Write<infer WritePayload, infer ReceiptRet>
    ? SendTransaction<WritePayload, ReceiptRet>
    : never;
};

// type CreateServiceBinding<Binding> = (
//   bindingDeclaration: BindingDeclaration<Binding>,
// ) => ServiceBinding<Binding>;

export function createServiceBinding<T>(
  options: BindingDeclaration<T>,
): ServiceBinding<T> {
  const { serviceName, client, model } = options;

  return Object.entries(model).reduce((service, [method, handler]) => {
    if (isRead(handler)) {
      service[method] = async inputPayload => {
        const queryParams: QueryServiceParam = await (handler.transform
          ? handler.transform(inputPayload)
          : { method, serviceName, payload: inputPayload });

        return client.queryService(queryParams);
      };
    } else if (isWrite(handler)) {
      const sendOrGenerateTransaction: SendTransaction = async (
        inputPayload,
        privateKey?,
      ) => {
        const transaction: Transaction = await (handler.transform
          ? handler.transform(inputPayload)
          : client.composeTransaction({
              method,
              payload: inputPayload,
              serviceName,
            }));

        if (!privateKey) {
          return transaction;
        }

        const tx = utils.signTransaction(transaction, privateKey);
        const txHash = await client.sendTransaction({
          ...tx.inputEncryption,
          ...tx.inputRaw,
        });
        const receipt: Receipt = await this.client.getReceipt(
          utils.toHex(txHash),
        );

        if (receipt.response.isError) {
          throw boom(`RPC error: ${receipt.response.ret}`);
        }

        return utils.safeParseJSON(receipt.response.ret);
      };

      service[method] = sendOrGenerateTransaction;
    }
    return service;
  }, ({} as any) as ServiceBinding<T>);
}
