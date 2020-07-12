import { BigNumber } from 'bignumber.js';
import { safeParseJSON, safeStringifyJSON } from './common';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const U64_MAX = (1n << 64n).toString();

test('safe parse json', () => {
  const str = safeStringifyJSON({
    big: new BigNumber(U64_MAX),
  });
  const json = safeParseJSON(str);

  const max = new BigNumber(U64_MAX);
  const big = json.big as BigNumber;
  expect(big.eq(max)).toBe(true);
});
