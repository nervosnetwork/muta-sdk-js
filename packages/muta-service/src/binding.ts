import { IAccount } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { invariant } from '@mutajs/shared';
import {
  QueryServiceParam,
  Receipt,
  ServiceResponse,
  SignedTransaction,
  Transaction,
} from '@mutajs/types';
import { capitalize, safeParseJSON, toHex } from '@mutajs/utils';

/**
 * Given an input payload, transform to [[QueryServiceParam]]
 */
export type QueryServiceParamTransform<P = any> = (
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
  if (!('type' in handler) || !('transform' in handler)) {
    return false;
  }
  return handler.type === 'read';
}

type WritePayloadHandler<P = any, R = any> = (
  payload: P,
) => Promise<Transaction<R>>;

/**
 *
 */
// @ts-ignore
interface WriteHandler<P = any, R = string> {
  (payload: P, privateKey: string | Buffer): Promise<SignedTransaction>;

  (payload: P): Promise<Transaction<R>>;
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
  if (!('type' in handler) || !('transform' in handler)) {
    return false;
  }
  return handler.type === 'write';
}

interface SendTransaction<PW = any, RW = any> {
  (payload: PW): Promise<Transaction<RW>>;

  (payload: PW, account: IAccount): Promise<Receipt<RW>>;
}

export type ServiceBinding<Binding> = {
  [method in keyof Binding]: Binding[method] extends Read<
      infer ReadPayload,
      infer QueryResponse
      >
    ? (payload: ReadPayload) => Promise<ServiceResponse<QueryResponse>>
    : Binding[method] extends Write<infer WritePayload, infer ReceiptRet>
      ? SendTransaction<WritePayload, ReceiptRet>
      : never;
};

export function createServiceBinding<T>(
  serviceName: string,
  model: T,
  options: { client: Client },
): ServiceBinding<T> {
  const { client } = options;

  return Object.entries(model).reduce((service, [method, handler]) => {
    if (isRead(handler)) {
      service[method] = async (inputPayload = '') => {
        const queryParams: QueryServiceParam = await (handler.transform
          ? handler.transform(inputPayload)
          : { method, serviceName, payload: inputPayload });

        return client.queryServiceDyn(queryParams);
      };
    } else if (isWrite(handler)) {
      // @ts-ignore
      const sendOrGenerateTransaction: SendTransaction = async (
        inputPayload,
        account?,
      ) => {
        const transaction = await (handler.transform
          ? handler.transform(inputPayload)
          : client.composeTransaction({
            method,
            payload: inputPayload,
            serviceName,
          }));

        if (!account) {
          return transaction;
        }

        const tx = account.signTransaction(transaction);
        let txHash: string;
        try {
          txHash = await client.sendTransaction(tx);
        } catch (e) {
          throw e;
        }

        const receipt: Receipt = await client.getReceipt(toHex(txHash));

        const response = receipt.response.response;
        invariant(
          !response.errorMessage,
          `RPC error: ${response.errorMessage}`,
        );

        try {
          receipt.response.response.succeedData = safeParseJSON(
            response.succeedData,
          );
        } catch {
          // return string only
        }

        return receipt;
      };

      service[method] = sendOrGenerateTransaction;
    }
    return service;
  }, ({} as any) as ServiceBinding<T>);
}

export type BindingClassPrototype<Binding> = {
  [method in keyof Binding]: Binding[method] extends Read<
      infer ReadPayload,
      infer QueryResponse
      >
    ? ReadPayload extends undefined
      ? () => Promise<ServiceResponse<QueryResponse>>
      : (payload: ReadPayload) => Promise<ServiceResponse<QueryResponse>>
    : Binding[method] extends Write<infer WritePayload, infer ReceiptRet>
      ? (payload: WritePayload) => Promise<Receipt<ReceiptRet>>
      : never;
};

export type ServiceBindingClass<T> = new (
  client: Client,
  account?: IAccount,
) => BindingClassPrototype<T>;

export function createBindingClass<T>(
  serviceName: string,
  model: T,
): ServiceBindingClass<T> {
  function BindingClass(client: Client, account?: IAccount) {
    const binding = createServiceBinding<T>(serviceName, model, { client });
    const prototypes = Object.entries(model).reduce(
      (prototype, [method, handler]) => {
        if (isRead(handler)) {
          prototype[method] = binding[method];
        } else if (isWrite(handler)) {
          prototype[method] = payload => {
            invariant(
              account,
              'Try to call a #[write] method without account is denied,' +
              ` need to new ${capitalize(
                serviceName,
              )}Service(client, account)`,
            );

            return binding[method](payload, account);
          };
        }

        return prototype;
      },
      {},
    );
    Object.assign(BindingClass.prototype, prototypes);
  }

  return (BindingClass as any) as ServiceBindingClass<T>;
}
