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

export function isVecType<T>(schema: unknown): schema is Vec<T> {
  return (schema as Vec<T>)?.[VecType] === true;
}

const MapType = 'Map' as const;
export type HashMap<T> = {
  [MapType]: true;
  type: T;
};

export function HashMap<T extends ServiceType>(type: T): HashMap<T> {
  return { [MapType]: true, type };
}

export function isHashMapType<T extends ServiceType>(
  schema: unknown,
): schema is HashMap<T> {
  return (schema as HashMap<T>)?.[MapType] === true;
}

const OptionType = 'Option' as const;
export type Option<T> = {
  [OptionType]: true;
  type: T;
};

export function Option<T extends ServiceType>(type: T): Option<T> {
  return { [OptionType]: true, type };
}

export function isOptionType<T>(schema: ServiceType): schema is Option<T> {
  return (schema as Option<T>)?.[OptionType] === true;
}

type Nested<T> = {
  [key in keyof T]: ServiceType;
};

export function isNestedType(schema: unknown): schema is Nested<unknown> {
  return schema && typeof schema === 'object' && !Array.isArray(schema);
}

export type ServiceType<T = unknown> =
  | Address
  // eslint-disable-next-line @typescript-eslint/ban-types
  | String
  | Bytes
  | Hash
  | u64
  | u32
  | Vec<T>
  | HashMap<T>
  | Nested<T>;
