import BigNumber from 'bignumber.js';

/**
 * ID, string
 */
export type ID = string;
/**
 * a 64bits number, represented by string
 */
export type Uint64 = string;
/**
 * a hash, represented by string, not sure the real length
 */
export type Hash = string;
/**
 * an address, represented by string, normally 42 char-length ('0x' takes 2 and the paylaod 20 bytes takes 40) for secp256k1
 */
export type Address = string;
/**
 * a short hand for string
 */
export type Bytes = string;
/**
 * a short hand for number
 */
export type Int = number;

/**
 * uint32
 */
export type u32 = number;
/**
 * uint64
 */
export type u64 = number | BigNumber;
/**
 * vector
 */
export type Vec<T> = T[];

/**
 * something like Option<T>
 */
export type Maybe<T> = T | null;
