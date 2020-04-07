import { publicKeyCreate as rawPublicKeyCreate } from 'secp256k1';
import { toBuffer } from './bytes';
import { keccak } from './hash';

export function publicKeyCreate(
  privateKey: Buffer | Uint8Array,
  compressed?: boolean,
): Buffer {
  return Buffer.from(
    rawPublicKeyCreate(Uint8Array.from(privateKey), compressed),
  );
}

/**
 * convert a public key to an account address
 * @param publicKey
 */
export function addressFromPublicKey(publicKey: Buffer | string): Buffer {
  const hashed = keccak(toBuffer(publicKey));
  return hashed.slice(0, 20);
}
