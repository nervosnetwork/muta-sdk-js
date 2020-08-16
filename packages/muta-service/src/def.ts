import { BigNumber } from '@mutadev/shared';
import { Maybe, Receipt, ServiceResponse, Transaction } from '@mutadev/types';
import { safeParseJSON, safeStringifyJSON } from '@mutadev/utils';
import {
  Address,
  bool,
  Bytes,
  Hash,
  HashMap,
  Option,
  String,
  u32,
  u64,
  Vec,
} from './types';

// eslint-disable-next-line
type StringType = Hash | Bytes | Address | String;

type _DynType =
  | string
  | number
  | BigNumber
  | boolean
  | _DynType[]
  | { [key: string]: _DynType };

// @formatter:off
// prettier-ignore
// mapping Rust service type definition to TypeScript definition
export type RustToTS<T> =
     T extends StringType ? string
   : T extends u32 ? number
   : T extends u64 ? BigNumber | number
   : T extends bool ? boolean
   // TODO wait for this PR merged
   //  https://github.com/microsoft/TypeScript/pull/40002
   // : T extends Option<infer P> ? Maybe<RustToTS<P>>
   : T extends Option<unknown> ? Maybe<_DynType>
   : T extends Vec<infer P> ? RustToTS<P>[]
   : T extends HashMap<infer P> ? {[key: string]: RustToTS<P>}
   : T extends Record<keyof T, unknown> ? {[key in keyof T] : RustToTS<T[key]>}
   : unknown;
// @formatter:on

export type IRead<P = unknown, R = unknown> = P extends null
  ? () => Promise<ServiceResponse<RustToTS<R>>>
  : (p: RustToTS<P>) => Promise<ServiceResponse<RustToTS<R>>>;

type SendTransactionAndWaitReceipt<P, R> = P extends null
  ? () => Promise<Receipt<RustToTS<R>>>
  : (payload: RustToTS<P>) => Promise<Receipt<RustToTS<R>>>;

export type IWrite<P = unknown, R = unknown> = SendTransactionAndWaitReceipt<
  P,
  R
> & {
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
