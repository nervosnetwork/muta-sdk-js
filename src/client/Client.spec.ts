import test from 'ava';
import { Muta } from '../Muta';
import { hexToNum } from '../utils';

const client = Muta.createDefaultMutaInstance().client();

test('test get latest block', async t => {
  const height = await client.getLatestBlockHeight();
  t.is(typeof height, 'number');
  t.true(height >= 0);
});

test('test get latest block without height', async t => {
  const block = await client.getBlock();
  const height = hexToNum(block.header.height);
  t.is(typeof height, 'number');
  t.true(height >= 0);
});

test('test get given block without height', async t => {
  const block = await client.getBlock('1');
  const height = hexToNum(block.header.height);
  t.is(typeof height, 'number');
  t.true(height >= 0);
});

test('current preHash eq last hash', async t => {
  const lastBlock = await client.getBlock();
  await client.waitForNextNBlock(1);

  const currentBlock = await client.getBlock();

  t.is(currentBlock.header.preHash, lastBlock.hash);
});
