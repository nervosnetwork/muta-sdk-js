/**
 * TRY to remove 0x from a hex string
 * if no 0x starts, do nothing
 * @param hex string
 */
export function rm0x(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

function warning(x: string) {
  // tslint:disable-next-line:no-console
  console.warn(x);
}

/**
 * parse to hex string
 * @param x , may be Buffer, number or string(add 0x if needed or do nothing if already find 0x)
 */
export function toHex(x: Uint8Array | Buffer | number | string): string {
  if (typeof x === 'string') {
    if (x.startsWith('0x')) {
      return x;
    }
    warning(
      'String other than 0x will be confused with decimal. ' +
        'This feature will be deprecated in the future.',
    );
    return '0x' + x;
  }
  if (typeof x === 'number') {
    const hex = Number(x).toString(16);
    return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
  }
  return '0x' + Buffer.from(x).toString('hex');
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
  return Buffer.from(rm0x(x), 'hex');
}

/**
 * convert a hex string to number
 * @param {string} x
 */
export function hexToNum(x: string): number {
  return Number(toHex(x));
}
