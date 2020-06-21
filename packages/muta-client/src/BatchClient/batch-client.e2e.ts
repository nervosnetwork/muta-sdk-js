import { Account } from '@mutajs/account';
import { Client } from '../Client';
import { retry } from '../retry';
import { BatchClient } from './';

const account = Account.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);

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

  const batchClient = new BatchClient();
  const txs = await retry(() => batchClient.getTransactions(hashes));

  expect(txs.every(tx => tx.txHash)).toBe(true);

  const receipts = await retry(() => batchClient.getReceipts(hashes));
  expect(receipts.every(receipt => receipt.txHash)).toBe(true);
});

test('failed when tx can not found', async () => {
  const batchClient = new BatchClient();
  const txs = batchClient.getTransactions([
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]);
  await expect(txs).rejects.toThrow();

  const receipts = batchClient.getReceipts([
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]);
  await expect(receipts).rejects.toThrow();
});
