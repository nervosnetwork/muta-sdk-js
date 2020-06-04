import { hexToNum } from '@mutajs/utils';
import { Client } from './Client';

const client = new Client();

test('get block should be correct', async () => {
  const lastBlock = await client.getBlock();
  expect(lastBlock.hash).toBeTruthy();

  const block1 = await client.getBlock('0x01');
  expect(block1.hash).toBeTruthy();
});

test('test get latest block', async () => {
  const height = await client.getLatestBlockHeight();
  expect(typeof height).toBe('number');
  expect(height >= 0).toBe(true);
});

test('test get latest block without height', async () => {
  const block = await client.getBlock();
  const height = hexToNum(block.header.height);
  expect(typeof height).toBe('number');
  expect(height >= 0).toBe(true);
});

test('test get given block without height', async () => {
  const block = await client.getBlock('0x01');
  const height = hexToNum(block.header.height);
  expect(typeof height).toBe('number');
  expect(height >= 0).toBe(true);
});

test('current prevHash eq last hash', async () => {
  const lastBlock = await client.getBlock();
  await client.waitForNextNBlock(1);

  const currentBlock = await client.getBlock();

  expect(currentBlock.header.prevHash).toBe(lastBlock.hash);
});
