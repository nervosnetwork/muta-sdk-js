import { Account } from "@mutadev/account";
import { Client, retry } from "@mutadev/client";
import { GetReceiptQuery, QueryServiceQuery } from "@mutadev/client-raw";
import { Hash, Transaction } from "@mutadev/types";
import { capitalize, safeParseJSON, safeStringifyJSON } from "@mutadev/utils";

export function createServiceBindingClass<R, W>(
  model: ServiceModel<R, W>
): ServiceClass<R, W> {
  const BindingClass = class {
    getServiceName: () => string;

    read: ReadPrototype<R>;

    write: WritePrototype<W>;

    constructor(client: Client = new Client(), account?: Account) {
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
        model: model.write,
        serviceName: model.serviceName,
      });
    }
  };

  return BindingClass as ServiceClass<R, W>;
}

interface CreateReadPrototypeOptions<R> {
  model: R;
  client: Client;
  serviceName: string;
}

function createReadPrototype<R>(
  options: CreateReadPrototypeOptions<R>
): ReadPrototype<R> {
  const { client, model, serviceName } = options;
  const rawClient = client.getRawClient();

  return Object.keys(model).reduce<ReadPrototype<R>>((r, method) => {
    const query = async <Payload, Return>(
      payload: Payload
    ): Promise<DeserializedQueryServiceQuery<Return>> => {
      const res = await rawClient.queryService({
        serviceName,
        method,
        payload: safeStringifyJSON(payload),
      });

      const succeedData = safeParseJSON(res.queryService.succeedData);
      return {
        ...res.queryService,
        succeedData,
      };
    };

    return Object.assign(r, { [method]: query });
  }, {} as ReadPrototype<R>);
}

export function read<Payload, Return>(): Read<Payload, Return> {
  return {};
}

interface CreateWritePrototypeOption<W> {
  model: W;
  serviceName: string;
  client: Client;
  account?: Account;
}

export function createWritePrototype<W>(
  options: CreateWritePrototypeOption<W>
): WritePrototype<W> {
  const { model, account, client, serviceName } = options;
  const sender = account?.address;

  return Object.keys(model).reduce<WritePrototype<W>>((w, method) => {
    async function composeTransaction<Payload extends object>(
      payload: Payload
    ): Promise<Transaction> {
      return client.composeTransaction({
        serviceName,
        method,
        payload,
        sender: sender!,
      });
    }

    async function sendTransaction<Payload extends object>(
      payload: Payload
    ): Promise<Hash> {
      if (!account) {
        throw new Error(
          "Try to call a #[write] method without account is denied," +
            ` account is required by ${capitalize(serviceName)}Service`
        );
      }

      const tx = await composeTransaction(payload);
      const signedTx = account.signTransaction(tx);
      return client.sendTransaction(signedTx);
    }

    async function sendTransactionAndGetReceipt<
      Payload extends object,
      Receipt
    >(payload: Payload): Promise<DeserializedReceipt<Receipt>> {
      const txHash = await sendTransaction(payload);
      const receipt = await retry(() => client.getReceipt(txHash));
      const succeedData = receipt.response.response.succeedData;
      const deserialized = succeedData ? safeParseJSON(succeedData) : {};
      receipt.response.response.succeedData = deserialized;
      return receipt;
    }

    const impl: any = sendTransactionAndGetReceipt;
    impl.sendTransaction = sendTransaction;
    impl.composeTransaction = composeTransaction;

    return Object.assign(w, { [method]: impl });
  }, {} as WritePrototype<W>);
}

export function write<Payload, Receipt>(): Write<Payload, Receipt> {
  return {};
}

interface ServiceModel<R, W> {
  serviceName: string;
  read: R;
  write: W;
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

// @ts-ignore
export interface Read<Payload = any, Return = any> {}

interface ReadMethod<Payload, Return> {
  (payload: Payload): Promise<DeserializedQueryServiceQuery<Return>>;
}

type Override<O, K extends keyof O, T> = Omit<O, K> & T;

type DeserializedQueryServiceQuery<T> = Override<
  QueryServiceQuery["queryService"],
  "succeedData",
  { succeedData: T }
>;

// @ts-ignore
export interface Write<Payload = any, Receipt = any> {}

interface WriteMethod<Payload, Receipt> {
  (payload: Payload): Promise<DeserializedReceipt<Receipt>>;

  sendTransaction(): Promise<Hash>;

  composeTransaction(): Promise<Transaction>;
}

type DeserializedReceipt<Receipt> = Override<
  GetReceiptQuery["getReceipt"],
  "response",
  {
    response: Override<
      GetReceiptQuery["getReceipt"]["response"],
      "response",
      {
        response: Override<
          GetReceiptQuery["getReceipt"]["response"]["response"],
          "succeedData",
          { succeedData: Receipt }
        >;
      }
    >;
  }
>;

export interface ServiceClass<R, W> {
  new (client?: Client, account?: Account): ServicePrototype<R, W>;
}
