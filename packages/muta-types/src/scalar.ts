import BigNumber from 'bignumber.js';

/**
 * a 64bits number, represented by string
 */
export type Uint64 = Bytes;
/**
 * a 32bits number, represented by string
 */
export type Uint32 = Bytes;
/**
 * a hash, represented by string, not sure the real length
 */
export type Hash = Bytes;
/**
 * an address, represented by string, normally 42 char-length ('0x' takes 2 and the paylaod 20 bytes takes 40) for secp256k1
 */
export type Address = Bytes;
/**
 * a short hand for string
 */
export type Bytes = string;
/**
 * A hexadecimal string
 */
export type Hex = Bytes;
/**
 * null type
 */
export type Null = null;

/**
 * uint32
 */
export type U32 = number;
/**
 * uint64
 */
export type U64 = number | BigNumber;
/**
 * vector
 */
export type Vec<T> = T[];

/**
 * something like Option<T>
 */
export type Maybe<T> = T | null;

export type Int = number;
