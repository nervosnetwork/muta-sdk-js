import test from 'ava';
import { Client } from './Client';

test('Test Method', async t => {
  const client = new Client('http://localhost:8000/graphql');
  const id = await client.getLatestEpochId();
  t.is(typeof id, 'string');
});
