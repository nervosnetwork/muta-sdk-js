import test from 'ava';
import { getDefaultMutaInstance } from '../builtin';

const client = getDefaultMutaInstance().client;

test('test get block height', async t => {
  const height = await client.getLatestBlockHeight();
  t.is(typeof height, 'number');
  t.true(height >= 0);
});
