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

export const bool = 'bool' as const;
export type bool = typeof bool;

const VecType = 'Vec' as const;

export type Vec<T extends ServiceType> = {
  [VecType]: true;
  type: T;
};

export function Vec<T extends ServiceType>(type: T): Vec<T> {
  return { [VecType]: true, type };
}

export function isVecType<T>(x: unknown): x is Vec<T> {
  return (x as Vec<T>)?.[VecType] === true;
}

type Nested<T> = {
  [key in keyof T]: ServiceType;
};

export function isNested(x: unknown): x is Nested<unknown> {
  return x && typeof x === 'object' && !Array.isArray(x);
}

export type ServiceType<T = unknown> =
  | Bytes
  | Hash
  | u64
  | u32
  | Vec<T>
  | Nested<T>;
