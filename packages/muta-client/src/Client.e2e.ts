import { hexToNum } from '@mutajs/utils';
import { Client } from './Client';

const client = new Client({
  consensusInterval: 3000,
  timeoutGap: 20,
  maxTimeout: 100000,
  defaultCyclesPrice: '0x1111',
  defaultCyclesLimit: '0x2222',
  chainId: '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
  endpoint: 'http://127.0.0.1:8000/graphql',
});

it('test get latest block', async () => {
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

test('current preHash eq last hash', async () => {
  const lastBlock = await client.getBlock();
  await client.waitForNextNBlock(1);

  const currentBlock = await client.getBlock();

  expect(currentBlock.header.preHash).toBe(lastBlock.hash);
});
