import { BigNumber, invariant } from '@mutadev/shared';
import { Bytes } from '@mutadev/types';

function startsWith0x(x: string): boolean {
  return x.startsWith('0x') || x.startsWith('0X');
}

/**
 * TRY to remove 0x from a hex string
 * if no 0x starts, do nothing
 * @param hex string
 */
export function rm0x(hex: string): string {
  return startsWith0x(hex) ? hex.slice(2) : hex;
}

function pad0x(x: string): string {
  const isEven = x.length % 2 === 0;
  const isStartsWith0x = startsWith0x(x);

  if (isEven && isStartsWith0x) return x;
  if (isEven && !isStartsWith0x) return '0x' + x;
  if (!isEven && isStartsWith0x) return '0x0' + x.slice(2);
  return '0x0' + x;
}

export function isValidHexString(x: unknown): boolean {
  if (typeof x !== 'string') {
    return false;
  }
  return /^(0x)?[a-f0-9]+$/i.test(x);
}

function isValidNumber(x: number): boolean {
  return Number.isFinite(x) && !Number.isNaN(x);
}

/**
 * convert a string to an even length hexadecimal representation string
 * @example
 * ```javascript
 * toHex('0xff') // '0xff'
 * toHex('0x000ff') // '0xff'
 * toHex('0xfff') // '0x0fff'
 * toHex('99') // '0x99'
 * ```
 */
export function toHex(
  x: Uint8Array | Buffer | number | string | BigNumber,
): string {
  if (typeof x === 'string') {
    invariant(isValidHexString(x), `can't parse ${x} to Hex`);
    return pad0x(x);
  }

  if (typeof x === 'number') {
    invariant(
      isValidNumber(x) && x >= 0,
      `can't parse ${x} to Hex, it is not a valid number`,
    );
    return pad0x(x.toString(16));
  }

  if (BigNumber.isBigNumber(x)) {
    invariant(
      !x.isNaN() && x.isFinite(),
      `can't parse BigNumber(${x}) to Hex, it is not a valid BigNumber`,
    );
  }
  return pad0x(Buffer.from(x).toString('hex'));
}

function isUint8Array(x: unknown): x is Uint8Array {
  return Object.prototype.toString.call(x) === '[object Uint8Array]';
}

/**
 * parse a hex string to buffer, if x is already a Buffer, do nothing
 * @param x , string or Buffer,
 */
export function toBuffer(x: string | Buffer | Uint8Array): Buffer {
  if (Buffer.isBuffer(x) || isUint8Array(x)) {
    return Buffer.from(x);
  }
  return Buffer.from(rm0x(toHex(x)), 'hex');
}

/**
 * convert a hex string to number
 * @param {string} x
 */
export function hexToNum(x: string): number {
  return Number(toHex(x));
}

export function toUint8Array(x: Bytes | Buffer | Uint8Array): Uint8Array {
  if (isUint8Array(x)) return x;
  return new Uint8Array(toBuffer(x));
}
