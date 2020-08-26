import { Account, tryGetDefaultAccount } from '@mutadev/account';
import { Client, retry } from '@mutadev/client';
import { invariant, warning } from '@mutadev/shared';
import { Receipt, ServiceResponse, Transaction } from '@mutadev/types';
import { mapValues, pickBy } from 'lodash';
import {
  IRead,
  IReadDef,
  isReadDef,
  isWriteDef,
  IWrite,
  IWriteDef,
  ReadMap,
  RustToTS,
  WriteMap,
} from './def';
import { ServiceType } from './types';
import { validate } from './validate';

export type Def<T, V> = Record<keyof T, V>;

export interface IServiceConstructor<T> {
  new (client?: Client, account?: Account): IService<T>;
}

export type PickValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type IService<T> = {
  read: ReadMap<PickValue<T, IReadDef>>;
  write: WriteMap<PickValue<T, IWriteDef>>;
};

interface CreateReadMethodOptions<T> {
  readonly defs: Def<T, IReadDef>;
  readonly client: Client;
  readonly serviceName: string;
}

function _validate(payloadType: unknown, value: unknown) {
  const message = validate(payloadType as ServiceType, value);
  if (message) throw new Error(message);
}

function createReadMethods<T>(
  options: CreateReadMethodOptions<T>,
): Def<T, IRead> {
  const { defs, client, serviceName } = options;

  return mapValues<Def<T, IReadDef>, IRead>(defs, (def, method: string) => {
    return async (
      payload: unknown,
    ): Promise<ServiceResponse<RustToTS<unknown>>> => {
      _validate(def.payloadType, payload);

      const res = await client.queryService({
        serviceName,
        method,
        payload: payload ? def.serialize(payload) : '',
      });

      const succeed = res.succeedData;
      const succeedData = (succeed ? def.deserialize(succeed) : {}) as RustToTS<
        unknown
      >;
      return {
        ...res,
        succeedData,
      };
    };
  });
}

interface CreateWriteMethodOptions<T> {
  readonly defs: Def<T, IWriteDef>;
  readonly serviceName: string;
  readonly client: Client;
  readonly account?: Account;
}

function createWriteMethods<T>(
  options: CreateWriteMethodOptions<T>,
): Def<T, IWrite> {
  const { serviceName, client, defs } = options;

  return mapValues(defs, (def, method: string) => {
    function getAccount(): Account {
      let account;
      if (!account) {
        try {
          account =
            options.account ?? client.getAccount() ?? tryGetDefaultAccount();
        } catch (e) {
          invariant(
            account,
            'account is required when calling #[write] method in service',
          );
        }
      }
      return account;
    }

    async function composeTransaction<Payload>(
      payload: Payload,
      skipCheck = false,
    ): Promise<Transaction> {
      if (!skipCheck) _validate(def.payloadType, payload);

      return client.composeTransaction({
        serviceName,
        method,
        payload,
        sender: getAccount().address,
      });
    }

    async function sendTransaction<Payload>(
      payload: Payload,
      skipCheck = false,
    ): Promise<string> {
      if (!skipCheck) _validate(def.payloadType, payload);

      const tx = await composeTransaction(payload, true);
      const signedTx = getAccount().signTransaction(tx);

      return client.sendTransaction(signedTx);
    }

    const mutate = (async (
      payload: unknown,
      skipCheck = false,
    ): Promise<Receipt<RustToTS<unknown>>> => {
      if (!skipCheck) _validate(def.payloadType, payload);

      const txHash = await sendTransaction(payload, true);
      const receipt = await retry(() => client.getReceipt(txHash));
      const succeedData = receipt.response.response.succeedData;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      receipt.response.response.succeedData = succeedData
        ? def.deserialize(succeedData)
        : {};

      return receipt;
    }) as IWrite;

    mutate.composeTransaction = composeTransaction;
    mutate.sendTransaction = sendTransaction;

    return mutate;
  });
}

export function createServiceClass<
  Defs extends Def<Defs, IReadDef | IWriteDef>
>(serviceName: string, serviceDef: Defs): IServiceConstructor<Defs> {
  const NamelessService = class implements IService<Defs> {
    serviceName: string = serviceName;

    read = {} as ReadMap<Defs>;
    write = {} as WriteMap<Defs>;

    constructor(client: Client = new Client(), account?: Account) {
      warning(
        account === undefined,
        `DEPRECATED: new SomeService(client, account) will be deprecated in the future, please migrate to new SomeService(new Client({ account: ... }))`,
      );

      Object.assign(
        this.read,
        createReadMethods({
          defs: pickBy(serviceDef, isReadDef),
          client,
          serviceName,
        }),
      );
      Object.assign(
        this.write,
        createWriteMethods({
          defs: pickBy(serviceDef, isWriteDef),
          account,
          client,
          serviceName,
        }),
      );
    }
  };

  Object.defineProperty(NamelessService, 'name', { value: serviceName });
  return NamelessService;
}
