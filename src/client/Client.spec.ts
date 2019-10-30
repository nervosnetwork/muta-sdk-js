import test from 'ava';
import randomBytes from 'random-bytes';
import { SyncAccount } from '../account';
import { Client } from './Client';

const client = new Client(
  'http://127.0.0.1:8000/graphql',
  '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036'
);

function randHex(len: number): string {
  return randomBytes.sync(len / 2).toString('hex');
}

test('test get epoch height', async t => {
  const id = await client.getLatestEpochId();
  t.is(typeof id, 'string');
});

test('get balance', async t => {
  const address = '0x10' + randHex(40);
  const id = '0x' + randHex(64);

  const balance = await client.getBalance(address, id);
  t.is(balance, 0, 'a random address should has no assert');
});

test('should return hash after sent transaction', async t => {
  const receiver = '0x10' + randHex(40);
  const carryingAssetId = '0x' + randHex(64);
  const carryingAmount = '0xffff';

  const transferTx = await client.prepareTransferTransaction({
    carryingAmount,
    carryingAssetId,
    receiver
  });

  const account = SyncAccount.fromPrivateKey(`0x${randHex(64)}`);
  const signed = account.signTransaction(transferTx);
  const txHash = await client.sendTransferTransaction(signed);

  t.truthy(txHash);
});
