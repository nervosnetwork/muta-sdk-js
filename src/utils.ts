import createKeccakHash from 'keccak';
import randomBytes from 'random-bytes';
import { publicKeyCreate } from 'secp256k1';

/**
 * remove 0x from a hex string
 * @param hex
 */
export function rm0x(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * parse to hex string
 * @param x
 */
export function toHex(x: Buffer | number | string): string {
  if (typeof x === 'string') {
    if (x.startsWith('0x')) {
      return x;
    }
    return '0x' + x;
  }
  if (typeof x === 'number') {
    const hex = Number(x).toString(16);
    return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
  }
  return '0x' + x.toString('hex');
}

/**
 * parse a hex string to buffer
 * @param x
 */
export function toBuffer(x: string | Buffer): Buffer {
  if (Buffer.isBuffer(x)) {
    return x;
  }
  return Buffer.from(rm0x(x), 'hex');
}

export function hash(x: string | Buffer): string {
  return toHex(hashBuf(toBuffer(x)));
}

export function hexToNum(x: string): number {
  return Number(toHex(x));
}

export function randomAddress() {
  return randomHex(20);
}

export function randomHex(n: number) {
  return toHex(randomBytes.sync(n).toString('hex'));
}

export function hashBuf(buffer: Buffer): Buffer {
  return createKeccakHash('keccak256')
    .update(buffer)
    .digest();
}

export { publicKeyCreate };
