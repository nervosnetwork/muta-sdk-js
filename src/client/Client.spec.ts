import test from 'ava';
import { getDefaultMutaInstance } from '../builtin';

const client = getDefaultMutaInstance().client;

test('test get block height', async t => {
  const id = await client.getLatestHeight();
  t.is(typeof id, 'string');

  const height = await client.getBlockHeight();
  t.true(height >= 0);
});
