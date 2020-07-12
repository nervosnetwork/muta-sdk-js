import { Account } from '@mutadev/account';
import { Client } from '../Client';
import { BatchClient } from './';

const account = new Account();

test('test batch transactions', async () => {
  const client = new Client();

  const tx1 = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: Math.random().toString(),
      supply: 10000,
      symbol: Math.random().toString(),
    },
    sender: account.address,
  });

  const tx2 = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: Math.random().toString(),
      supply: 10000,
      symbol: Math.random().toString(),
    },
    sender: account.address,
  });

  const hashes = await Promise.all([
    client.sendTransaction(account.signTransaction(tx1)),
    client.sendTransaction(account.signTransaction(tx2)),
  ]);

  await client.waitForNextNBlock(3);
  const batchClient = new BatchClient();
  const txs = await batchClient.getTransactions(hashes);
  expect(txs.every((tx) => tx!.txHash)).toBe(true);

  const receipts = await batchClient.getReceipts(hashes);
  expect(receipts.every((receipt) => receipt!.txHash)).toBe(true);
});

test('null when try to get a non-existent transaction ', async () => {
  const batchClient = new BatchClient();
  const txs = await batchClient.getTransactions([
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]);
  await expect(txs).toEqual([null]);

  const receipts = await batchClient.getReceipts([
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]);
  await expect(receipts).toEqual([null]);
});
