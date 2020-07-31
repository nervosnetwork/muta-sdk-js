import { Address, Bytes } from '@mutadev/types';
import randomBytes from 'randombytes';
import { decodeAddress } from './account';
import { toHex } from './bytes';

/**
 * generate given length random hex string
 * @param n
 */
export function randomHex(n: number): Bytes {
  return toHex('0x' + randomBytes(n).toString('hex'));
}

/**
 * generate a random {@link Address}
 */
export function randomAddress(prefix?: string): Address {
  return decodeAddress(randomBytes(20), prefix);
}

/**
 * generate a random 32 bytes {@link Bytes}
 */
export function randomNonce(): Bytes {
  return randomHex(32);
}
