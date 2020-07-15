import { Account } from '@mutadev/account';
import { Client, retry } from '@mutadev/client';
import { GetReceiptQuery, QueryServiceQuery } from '@mutadev/client-raw';
import { Any, Hash, Transaction } from '@mutadev/types';
import { capitalize, safeParseJSON, safeStringifyJSON } from '@mutadev/utils';
import { defaults } from 'lodash';
import { DeepNonNullable } from 'utility-types';

export function createServiceBindingClass<
  R extends ReadModel<R>,
  W extends WriteModel<W>
>(options: CreateServiceBindingClassOptions<R, W>): ServiceClass<R, W> {
  const BindingClass = class {
    getServiceName: () => string;

    read: ReadPrototype<R>;

    write: WritePrototype<W>;

    constructor(client: Client = new Client(), account: Account = new Account()) {
      const model: ServiceModel<R, W> = defaults(options, {
        read: {},
        write: {},
      });

      this.getServiceName = () => {
        return model.serviceName;
      };
      this.read = createReadPrototype({
        model: model.read,
        client,
        serviceName: model.serviceName,
      });
      this.write = createWritePrototype({
        account,
        client,
        model: model.write as WriteRecord,
        serviceName: model.serviceName,
      });
    }
  };

  return BindingClass as ServiceClass<R, W>;
}

type ReadModel<R = unknown> = {
  [key in keyof R]: R[key] extends Read<infer Payload, infer Return>
    ? Read<Payload, Return>
    : never;
};
type ReadRecord = Record<string, Read>;

type WriteModel<W = unknown> = {
  [key in keyof W]: W[key] extends Write<infer Payload, infer Receipt>
    ? Write<Payload, Receipt>
    : never;
};
type WriteRecord = Record<string, Write>;

interface ServiceModel<R, W> {
  serviceName: string;
  read: R;
  write: W;
}

type CreateServiceBindingClassOptions<R, W> = Pick<
  ServiceModel<R, W>,
  'serviceName'
> &
  Partial<ServiceModel<R, W>>;

interface CreateReadPrototypeOptions {
  readonly model: ReadRecord;
  readonly client: Client;
  readonly serviceName: string;
}

function createReadPrototype<R>(
  options: CreateReadPrototypeOptions,
): ReadPrototype<R> {
  const { client, model, serviceName } = options;
  const rawClient = client.getRawClient();

  return Object.keys(model).reduce<ReadPrototype<R>>((r, method) => {
    const query = async <Payload, Ret>(
      payload: Payload,
    ): Promise<DeserializedQueryServiceQuery<Ret>> => {
      const { serializePayload, deserializeRet } = model[method];

      const res = await rawClient.queryService({
        serviceName,
        method,
        payload: payload ? serializePayload(payload) : '',
      });

      const succeed = res.queryService.succeedData;
      const succeedData = (succeed ? deserializeRet(succeed) : {}) as Ret;
      return {
        ...res.queryService,
        succeedData,
      };
    };

    return Object.assign(r, { [method]: query });
  }, {} as ReadPrototype<R>);
}

export function read<Payload, Return>(
  options?: Partial<Read<Payload, Return>>,
): Read<Payload, Return> {
  return defaults(options, {
    deserializeRet: safeParseJSON,
    serializePayload: safeStringifyJSON,
  });
}

interface CreateWritePrototypeOption {
  model: WriteRecord;
  serviceName: string;
  client: Client;
  account?: Account;
}

export function createWritePrototype<W extends WriteModel<W>>(
  options: CreateWritePrototypeOption,
): WritePrototype<W> {
  const { model, account, client, serviceName } = options;
  const sender = account?.address;

  return Object.keys(model).reduce<WritePrototype<W>>((w, method) => {
    const { deserializeReceipt } = model[method];

    async function composeTransaction<Payload extends string | Any>(
      payload: Payload,
    ): Promise<Transaction> {
      if (!sender) {
        throw new Error('sender can not be empty when composeTransaction');
      }
      return client.composeTransaction({
        serviceName,
        method,
        payload,
        sender,
      });
    }

    async function sendTransaction<Payload extends Any>(
      payload: Payload,
    ): Promise<Hash> {
      if (!account) {
        throw new Error(
          'Try to call a #[write] method without account is denied,' +
            ` account is required by ${capitalize(serviceName)}Service`,
        );
      }

      const tx = await composeTransaction(payload);
      const signedTx = account.signTransaction(tx);
      return client.sendTransaction(signedTx);
    }

    const impl: WriteMethod = async <Payload extends Any, Receipt>(
      payload: Payload,
    ): Promise<DeserializedReceipt<Receipt>> => {
      const txHash = await sendTransaction(payload);
      const receipt = await retry(() => client.getReceipt(txHash));
      const succeedData = receipt.response.response.succeedData;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      receipt.response.response.succeedData = succeedData
        ? deserializeReceipt(succeedData)
        : {};

      return (receipt as unknown) as DeserializedReceipt<Receipt>;
    };
    impl.composeTransaction = composeTransaction;
    impl.sendTransaction = sendTransaction;

    return Object.assign(w, { [method]: impl });
  }, {} as WritePrototype<W>);
}

export function write<Payload, Receipt>(
  options?: Partial<Write<Payload, Receipt>>,
): Write<Payload, Receipt> {
  return defaults(options, {
    deserializeReceipt: safeParseJSON,
    serializePayload: safeStringifyJSON,
  });
}

interface ServicePrototype<R, W> {
  read: ReadPrototype<R>;
  write: WritePrototype<W>;

  getServiceName(): string;
}

type ReadPrototype<R> = {
  [key in keyof R]: R[key] extends Read<infer Payload, infer Return>
    ? ReadMethod<Payload, Return>
    : never;
};

type WritePrototype<W> = {
  [key in keyof W]: W[key] extends Write<infer Payload, infer Receipt>
    ? WriteMethod<Payload, Receipt>
    : never;
};

export interface Read<Payload = unknown, Return = unknown> {
  serializePayload(payload: Payload): string;

  deserializeRet(ret: string): Return;
}

type ReadMethod<Payload, Return> = Payload extends null
  ? () => Promise<DeserializedQueryServiceQuery<Return>>
  : (payload: Payload) => Promise<DeserializedQueryServiceQuery<Return>>;

type Override<O, K extends keyof O, T> = Omit<O, K> & T;

type DeserializedQueryServiceQuery<T> = Override<
  QueryServiceQuery['queryService'],
  'succeedData',
  { succeedData: T }
>;

export interface Write<Payload = Any, Receipt = Any> {
  serializePayload(payload: Payload): string;

  deserializeReceipt(receipt: string): Receipt;
}

type WriteAndWaitReceipt<Payload, Receipt> = (
  payload: Payload,
) => Promise<DeserializedReceipt<Receipt>>;

type WriteWithoutReceipt<Payload> = {
  sendTransaction: (payload: Payload) => Promise<Hash>;

  composeTransaction: (payload: Payload) => Promise<Transaction>;
};

type WriteMethod<Payload = Any, Receipt = Any> = WriteAndWaitReceipt<
  Payload,
  Receipt
> &
  WriteWithoutReceipt<Payload>;

type ReceiptQuery = DeepNonNullable<GetReceiptQuery>['getReceipt'];
type DeserializedReceipt<Receipt> = Override<
  ReceiptQuery,
  'response',
  {
    response: Override<
      ReceiptQuery['response'],
      'response',
      {
        response: Override<
          ReceiptQuery['response']['response'],
          'succeedData',
          { succeedData: Receipt }
        >;
      }
    >;
  }
>;

export interface ServiceClass<R, W> {
  new (client?: Client, account?: Account): ServicePrototype<R, W>;
}
