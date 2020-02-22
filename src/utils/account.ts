import { publicKeyCreate } from 'secp256k1';
import { toBuffer } from './bytes';
import { keccak } from './hash';

export { publicKeyCreate };

/**
 * convert a public key to an account address
 * @param publicKey
 */
export function addressFromPublicKey(publicKey: Buffer | string): Buffer {
  const hashed = keccak(toBuffer(publicKey));
  return hashed.slice(0, 20);
}
