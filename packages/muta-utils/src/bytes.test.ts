import { toHex } from './bytes';

test('test toHex', () => {
  expect(toHex('0xff')).toBe('0xff');
  expect(toHex('0x000ff')).toBe('0x0000ff');
  expect(toHex('0xfff')).toBe('0x0fff');
  expect(toHex('99')).toBe('0x99');
  expect(toHex('0X123')).toBe('0x0123');

  expect(() => toHex('zzz')).toThrow();

  expect(toHex(0)).toBe('0x00');
  expect(toHex(1)).toBe('0x01');
  expect(toHex(15)).toBe('0x0f');
  expect(toHex(16)).toBe('0x10');
  expect(() => toHex(NaN)).toThrow();
  expect(() => toHex(Infinity)).toThrow();

  expect(toHex(Buffer.from('ffff', 'hex'))).toBe('0xffff');
});
