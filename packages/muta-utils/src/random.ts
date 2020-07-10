import { Address, Bytes } from '@mutadev/types';
import randomBytes from 'randombytes';
import { toHex } from './bytes';

/**
 * generate given length random hex string
 * @param n
 */
export function randomHex(n: number): Bytes {
  return toHex('0x' + randomBytes(n).toString('hex'));
}

/**
 * generate a random [[Address]]
 */
export function randomAddress(): Address {
  return randomHex(20);
}

/**
 * generate a random [[Nonce]]
 */
export function randomNonce(): Bytes {
  return randomHex(32);
}
