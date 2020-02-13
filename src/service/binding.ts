import { Account } from '../account';
import { Client } from '../client';
import { debug, error } from '../debug';
import { boom } from '../error';
import {
  ExecResp,
  QueryServiceParam,
  Receipt,
  SignedTransaction,
  Transaction,
} from '../type';
import * as utils from '../utils';

/**
 * A type for those functions which transform an any type payload into [[QueryServiceParam]]
 */
export type QueryServiceParamTransform<P = any> = (
  payload: P,
) => QueryServiceParam<P> | Promise<QueryServiceParam<P>>;

/**
 *
 * Mark a service **read** method, so that we can make sure on this method the client calls [[queryService]]
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

type WritePayloadHandler<P = any> = (payload: P) => Promise<Transaction>;

// @ts-ignore
interface WriteHandler<P = any, R = string> {
  (payload: P, privateKey: string | Buffer): Promise<SignedTransaction>;

  (payload: P): Promise<Transaction>;
}

/**
 * Mark a service **write** method, so that we can make sure on this method the client calls [[sendTransaction]]
 */
// @ts-ignore
export interface Write<P = any, R = string> {
  type: 'write';
  transform: WritePayloadHandler<P>;
}

/**
 * a formal way to create a [[Write]] object
 * @param transform
 */
export function write<P, R>(transform?: WritePayloadHandler<P>): Write<P, R> {
  return {
    transform,
    type: 'write',
  };
}

/**
 * check if a method is a write method
 * @param handler
 */
function isWrite(handler: any): handler is Write {
  if (!('type' in handler) || !('transform' in handler)) {
    return false;
  }
  return handler.type === 'write';
}

/**
 * if you only give a write payload, so it can only generate a [[Transaction]]
 * but if you give both a write payload and a private key, it can proceed and return you a [[Receipt]]
 */
interface SendTransaction<PW = any, RW = any> {
  (payload: PW): Promise<Transaction>;

  (payload: PW, privateKey: string | Buffer): Promise<Receipt<RW>>;
}

/**
 * deduct the type from [[Read]] and [[Write]]
 * if the handler is [[Read]], so it will finally return you an ExecResp<>
 * or the handler is [[Write]], returns [[SendTransaction]], note that [[SendTransaction]] contains 2 ways
 */
export type ServiceBinding<Binding> = {
  [method in keyof Binding]: Binding[method] extends Read<
    infer ReadPayload,
    infer QueryResponse
  >
    ? (payload: ReadPayload) => Promise<ExecResp<QueryResponse>>
    : Binding[method] extends Write<infer WritePayload, infer ReceiptRet>
    ? SendTransaction<WritePayload, ReceiptRet>
    : never;
};

/**
 *  This is the main logic when you call a Read or Write Method.
 *  The Read and Write handler takes responsibility to convert data and mark the way how the client should
 *  communicate to the node, which is 'read'-queryService or 'write'-sendTransaction
 * @param serviceName the Service name
 * @param model the definition of all methods with names, params and return types, and its handler
 * @param options
 */
export function createServiceBinding<T>(
  serviceName: string,
  model: T,
  options: { client: Client },
): ServiceBinding<T> {
  const { client } = options;

  return Object.entries(model).reduce((service, [method, handler]) => {
    if (isRead(handler)) {
      service[method] = async inputPayload => {
        const queryParams: QueryServiceParam = await (handler.transform
          ? handler.transform(inputPayload)
          : { method, serviceName, payload: inputPayload });

        return client.queryServiceDyn(queryParams);
      };
    } else if (isWrite(handler)) {
      // @ts-ignore
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
        debug(`sending signed tx`);
        debug('%O', tx);

        let txHash: string;
        try {
          txHash = await client.sendTransaction({
            ...tx.inputEncryption,
            ...tx.inputRaw,
          });
          debug(`tx sent: %s`, txHash);
        } catch (e) {
          error(e);
          throw e;
        }

        const receipt: Receipt = await client.getReceipt(utils.toHex(txHash));

        if (receipt.response.isError) {
          throw boom(`RPC error: ${receipt.response.ret}`);
        } else {
          try {
            receipt.response.ret = utils.safeParseJSON(receipt.response.ret);
          } catch {
            // return string only
          }
        }

        return receipt;
      };

      service[method] = sendOrGenerateTransaction;
    }
    return service;
  }, ({} as any) as ServiceBinding<T>);
}

/**
 * deduct the type from [[Read]] and [[Write]]
 * if the handler is [[Read]], so it will finally return you an ExecResp<>
 * or the handler is [[Write]], returns [[Receipt]]
 */
export type BindingClassPrototype<Binding> = {
  [method in keyof Binding]: Binding[method] extends Read<
    infer ReadPayload,
    infer QueryResponse
  >
    ? (payload: ReadPayload) => Promise<ExecResp<QueryResponse>>
    : Binding[method] extends Write<infer WritePayload, infer ReceiptRet>
    ? (payload: WritePayload) => Promise<Receipt<ReceiptRet>>
    : never;
};

/**
 * an alias
 */
type ServiceBindingClass<T> = new (
  client: Client,
  account: Account,
) => BindingClassPrototype<T>;

/**
 * this function will takes your model contains definition of methods and their handler
 * and then register them into the prototype of the Service
 * @param serviceName the name of the service
 * @param model definition of methods and their handler
 */
export function createBindingClass<T>(
  serviceName: string,
  model: T,
): ServiceBindingClass<T> {
  function BindingClass(client: Client, account: Account) {
    const binding = createServiceBinding<T>(serviceName, model, { client });
    const prototypes = Object.entries(model).reduce(
      (prototype, [method, handler]) => {
        if (isRead(handler)) {
          prototype[method] = binding[method];
        } else if (isWrite(handler)) {
          prototype[method] = payload => {
            // @ts-ignore
            return binding[method](payload, account._privateKey);
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
