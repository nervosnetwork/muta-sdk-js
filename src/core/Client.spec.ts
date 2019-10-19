import test from 'ava';
import * as _ from 'lodash';
import { Client } from './Client';

const client = new Client('http://localhost:8000/graphql');

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
  t.is(balance, 0);
});
