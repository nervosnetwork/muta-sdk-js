import test from 'ava';
import { getDefaultMutaInstance } from '../builtin';

const client = getDefaultMutaInstance().client;

test('test get epoch height', async t => {
  const id = await client.getLatestEpochId();
  t.is(typeof id, 'string');

  const height = await client.getEpochHeight();
  t.true(height >= 0);
});
