import BigNumber from 'bignumber.js';

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

export { Address, Hash } from './scalar';
