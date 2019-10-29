import test from 'ava';
import * as _ from 'lodash';
import { Client } from './Client';

const client = new Client(
  'http://127.0.0.1:8000/graphql',
  '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036'
);

function randHex(len: number): string {
  return _.random(2 ** 256)
    .toString(16)
    .padStart(len, '0')
    .slice(0, len);
}

test('test get epoch height', async t => {
  const id = await client.getLatestEpochId();
  t.is(typeof id, 'string');
});

test('get balance', async t => {
  const address = '0x10' + randHex(40);
  const id = '0x' + randHex(64);

  const balance = await client.getBalance(address, id);
  t.is(balance, 0, 'a random address should has no assert');
});
