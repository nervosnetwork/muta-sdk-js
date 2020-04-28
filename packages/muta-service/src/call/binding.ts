import { Account } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { invariant } from '@mutajs/shared';
import { Hash, Receipt, ServiceResponse } from '@mutajs/types';
import { capitalize } from '@mutajs/utils';
import PLazy from 'p-lazy';
import { MutationHook, QueryHook } from './hook';

interface QueryMethod<Payload = any, Response = any> {
  (payload: Payload): Promise<ServiceResponse<Response>>;
}

interface WaitFor<T> {
  (wait: 'transaction'): Promise<Hash>;

  (wait: 'receipt'): Promise<Receipt<T>>;
}

interface Waitable<T> {
  waitFor: WaitFor<T>;
}

interface WaitableResult<T> extends Promise<T>, Waitable<T> {}

interface MutationMethod<Payload = any, Response = any> {
  (payload: Payload): WaitableResult<Receipt<Response>>;
}

export interface IService<Q, M> {
  name: string;
  query: Q;
  mutation: M;
}

export interface ServiceConstructor<Q extends QueryHookMethod, M> {
  new (client: Client, account: Account): IService<Q, M>;
}

type QueryHookMethod<T = any> = {
  [key in keyof T]: T[key] extends QueryHook<infer P, infer R>
    ? QueryMethod<P, R>
    : never;
};

type MutationHookMethod<T = any> = {
  [key in keyof T]: T[key] extends MutationHook<infer P, infer R>
    ? MutationMethod<P, R>
    : never;
};

interface Model<T> {
  [key: string]: T;
}

export function createBindingClass<
  Q extends Model<QueryHook>,
  M extends Model<MutationHook>
>(
  name: string,
  query: Q,
  mutation: M,
): ServiceConstructor<QueryHookMethod<Q>, MutationHookMethod<M>> {
  return class Service
    implements IService<QueryHookMethod<Q>, MutationHookMethod<M>> {
    name;

    query;

    mutation;

    private client: Client;
    private account: Account;

    constructor(client: Client, account: Account) {
      this.name = name;
      this.client = client;
      this.account = account;

      const self = this;

      this.query = Object.keys(query).reduce((queries, method) => {
        const hook = query[method];
        queries[method] = async function(payload: any) {
          payload = await hook.handlePayload(payload);

          const res = await self.client.queryService({
            method: method,
            payload,
            serviceName: self.name,
          });
          return hook.handleResponse(res);
        };

        return queries;
      }, {});

      this.mutation = Object.keys(mutation).reduce((mutations, method) => {
        const hook = mutation[method];

        mutations[method] = function(payload: any): WaitableResult<any> {
          invariant(
            account,
            'Try to call a mutation method without account is denied,' +
              ` need to new ${capitalize(name)}Service(client, account)`,
          );

          async function sendTransaction() {
            payload = await hook.handlePayload(payload);
            const rawTx = await self.client.composeTransaction({
              method,
              payload,
              serviceName: self.name,
            });
            const signedTx = self.account.signTransaction(rawTx);
            return self.client.sendTransaction(signedTx);
          }

          async function waitForReceipt(txHash: string) {
            const receipt = await self.client.getReceipt(txHash);
            return hook.handleResponse(receipt);
          }

          // lazy evaluation is to ensure that waitFor("transaction")
          // will not immediately execute the receipt
          const txP: Promise<Hash> = new PLazy(resolve =>
            resolve(sendTransaction()),
          );
          const receiptP: Promise<Receipt> = new PLazy(resolve =>
            resolve(txP.then(waitForReceipt)),
          );

          const result: WaitableResult<any> = receiptP as WaitableResult<any>;

          // @ts-ignore
          result.waitFor = type => {
            if (type === 'transaction') {
              return txP;
            }
            return receiptP;
          };

          return result;
        };

        return mutations;
      }, {});
    }
  };
}
