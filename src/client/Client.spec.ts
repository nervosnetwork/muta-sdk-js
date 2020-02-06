import test from 'ava';
import { Muta } from '../Muta';

const client = Muta.createDefaultMutaInstance().client;

test('test get block height', async t => {
  const height = await client.getLatestBlockHeight();
  t.is(typeof height, 'number');
  t.true(height >= 0);
});
