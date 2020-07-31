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

export function decodeAddress(
  addressBuf: Buffer,
  prefix = DefaultVariables.get('MUTA_ADDRESS_HRP'),
): Address {
  return encode(prefix, toWords(addressBuf));
}

export function encodeAddress(address: Address): Buffer {
  const { words } = decode(address);
  return Buffer.from(fromWords(words));
}

/**
 * convert a public key to an account address
 */
export function addressFromPublicKey(
  publicKey: Uint8Array | Buffer | Bytes,
  prefix = DefaultVariables.get('MUTA_ADDRESS_HRP'),
): Address {
  const uncompressedPublicKey = toBuffer(
    publicKeyConvert(toUint8Array(publicKey), false).slice(1),
  );
  const addressBuf = keccak(uncompressedPublicKey).slice(-20);
  return decodeAddress(addressBuf, prefix);
}
