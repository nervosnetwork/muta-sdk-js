/**
 * TRY to remove 0x from a hex string
 * if no 0x starts, do nothing
 * @param hex string
 */
import { boom } from '../error';

export function rm0x(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * parse to hex string
 * @param x , may be Buffer, number or string(add 0x if needed or do nothing if already find 0x)
 */
export function toHex(x: Buffer | number | string): string {
  if (typeof x === 'string') {
    if (x.startsWith('0x')) {
      return x;
    }
    throw boom('Hex string MUST starts with 0x');
  }
  if (typeof x === 'number') {
    const hex = Number(x).toString(16);
    return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
  }
  return '0x' + x.toString('hex');
}

/**
 * parse a hex string to buffer, if x is already a Buffer, do nothing
 * @param x , string or Buffer,
 */
export function toBuffer(x: string | Buffer): Buffer {
  if (Buffer.isBuffer(x)) {
    return x;
  }
  return Buffer.from(rm0x(x), 'hex');
}

/**
 * convert a hex string to number
 * @param x
 */
export function hexToNum(x: string): number {
  return Number(toHex(x));
}
