import { BigNumber } from '@mutadev/shared';
import { Receipt, ServiceResponse, Transaction } from '@mutadev/types';
import { safeParseJSON, safeStringifyJSON } from '@mutadev/utils';
import { Address, bool, Bytes, Hash, String, u32, u64, Vec } from './types';

// eslint-disable-next-line
type JSONString = Hash | Bytes | Address | String;

// @formatter:off
// prettier-ignore
// mapping Rust service type definition to TypeScript definition
export type ServiceToTS<T> =
     T extends JSONString ? string
   : T extends u32 ? number
   : T extends u64 ? BigNumber | number
   : T extends bool ? boolean
   : T extends Vec<infer P> ? ServiceToTS<P>[]
   : T extends Record<keyof T, unknown> ? {[key in keyof T] : ServiceToTS<T[key]>}
   : unknown;
// @formatter:on

export type IRead<P = unknown, R = unknown> = P extends null
  ? () => Promise<ServiceResponse<ServiceToTS<R>>>
  : (p: ServiceToTS<P>) => Promise<ServiceResponse<ServiceToTS<R>>>;

type SendTransactionAndWaitReceipt<P, R> = P extends null
  ? () => Promise<Receipt<R>>
  : (payload: ServiceToTS<P>) => Promise<Receipt<R>>;

export type IWrite<P = unknown, R = unknown> =
  SendTransactionAndWaitReceipt<P, R> & {
  sendTransaction: (payload: P) => Promise<string>;
  composeTransaction: (payload: P) => Promise<Transaction>;
};

export type ReadMap<T> = {
  [key in keyof T]: T[key] extends IReadDef<infer P, infer R>
    ? IRead<P, R>
    : never;
};
export type WriteMap<T> = {
  [key in keyof T]: T[key] extends IWriteDef<infer P, infer R>
    ? IWrite<P, R>
    : never;
};

interface IMethodDef<Payload, Response> {
  payloadType: Payload;
  responseType: Response;

  serialize: (x: unknown) => string;
  deserialize: (receipt: string) => Response;
}

export interface IReadDef<Payload = unknown, Response = unknown>
  extends IMethodDef<Payload, Response> {
  type: 'read';
}

export function isReadDef(x: unknown): x is IReadDef {
  return (x as IReadDef)?.type === 'read';
}

export function isWriteDef(x: unknown): x is IWriteDef {
  return (x as IWriteDef)?.type === 'write';
}

export interface IWriteDef<Payload = unknown, Response = unknown>
  extends IMethodDef<Payload, Response> {
  type: 'write';
}

/**
 * get a {@link IReadDef} with the `Payload` and `Response`
 */
export function read<Payload, Response>(
  payloadType: Payload,
  responseType: Response,
): IReadDef<Payload, Response> {
  return {
    type: 'read',
    payloadType,
    responseType,
    serialize: safeStringifyJSON,
    deserialize: safeParseJSON,
  };
}

export function write<Payload, Response>(
  payloadType: Payload,
  responseType: Response,
): IWriteDef<Payload, Response> {
  return {
    type: 'write',
    payloadType,
    responseType,
    serialize: safeStringifyJSON,
    deserialize: safeParseJSON,
  };
}
