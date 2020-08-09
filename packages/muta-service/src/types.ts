export const Bytes = 'Bytes' as const;
export type Bytes = typeof Bytes;

export const Hash = 'Hash' as const;
export type Hash = typeof Hash;

export const Address = 'Address' as const;
export type Address = typeof Address;

export const String = 'String' as const;
export type String = typeof String;

export const u64 = 'u64' as const;
export type u64 = typeof u64;

export const u32 = 'u32' as const;
export type u32 = typeof u32;

const VecSymbol = Symbol('Vec');

export type Vec<T> = {
  [VecSymbol]: true;
  type: T;
};

type Nested<T> = {
  [key in keyof T]: ServiceTypes;
};

export function Vec<T extends ServiceTypes>(type: T): Vec<T> {
  return { [VecSymbol]: true, type };
}

export function isVec<T>(x: unknown): x is Vec<T> {
  return (x as Vec<T>)?.[VecSymbol] === true;
}

export type ServiceTypes<T = unknown> =
  | Bytes
  | Hash
  | u64
  | u32
  | Vec<T>
  | Nested<T>;
