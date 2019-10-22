
export function rm0x(hex: string) {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

export function toHex(x: Buffer | number | string): string {
  if (typeof x === 'string') {
    if (x.startsWith('0x')) return x;
    return '0x' + x;
  }
  if (typeof x === 'number') {
    const hex = Number(x).toString(16);
    return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
  }
  return '0x' + x.toString('hex');
}

export function toBuffer(x: string): Buffer {
  return Buffer.from(rm0x(x), 'hex');
}
