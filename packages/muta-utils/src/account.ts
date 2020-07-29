import { DefaultVariables } from '@mutadev/defaults';
import { Address, Bytes } from '@mutadev/types';
import { decode, encode, fromWords, toWords } from 'bech32';
import {
  publicKeyConvert,
  publicKeyCreate as rawPublicKeyCreate,
} from 'secp256k1';
import { toBuffer, toUint8Array } from './bytes';
import { keccak } from './hash';

export function privateKeyToPublicKey(privateKey: Buffer | Uint8Array): Buffer {
  return Buffer.from(rawPublicKeyCreate(Uint8Array.from(privateKey)));
}

/**
 * generate an address buffer from a public key,
 */
export function addressBufferFromPublicKey(
  publicKey: Uint8Array | Buffer | string,
): Buffer {
  const uncompressedPublicKey = toBuffer(
    publicKeyConvert(toUint8Array(publicKey), false).slice(1),
  );
  return keccak(uncompressedPublicKey).slice(-20);
}

/**
 * convert a public key to an account address
 */
export function addressFromPublicKey(
  publicKey: Uint8Array | Buffer | Bytes,
  prefix = DefaultVariables.get('MUTA_ADDRESS_HRP'),
): Address {
  const address = addressBufferFromPublicKey(publicKey);
  return encode(prefix, toWords(address));
}

export function addressToBuffer(address: Address): Buffer {
  const { words } = decode(address);
  return Buffer.from(fromWords(words));
}
