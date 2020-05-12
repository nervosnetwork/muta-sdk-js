import { DefaultAccount, DefaultMultiSigAccount } from '@mutajs/account';
import { IAccount } from '@mutajs/account/lib/IAccount';
import { hexToNum } from '@mutajs/utils';
import { Client } from './Client';

const client = new Client({
  consensusInterval: 3000,
  timeoutGap: 20,
  maxTimeout: 100000,
  defaultCyclesPrice: '0x01',
  defaultCyclesLimit: '0xffff',
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

async function createAsset(account: IAccount) {
  const tx = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: Math.random().toString(),
      symbol: Math.random().toString(),
      supply: 10000000,
    },
  });

  const signedTx = account.signTransaction(tx);

  const txHash = await client.sendTransaction(signedTx);
  return client.getReceipt(txHash);
}

test('test single sig with asset transfer', async () => {
  const account = DefaultAccount.fromPrivateKey(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  );

  const receipt = await createAsset(account);
  expect(receipt.response.response.succeedData).toBeTruthy();
});

test('test multiple sig with create_asset', async () => {
  const pk1 = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex',
  );
  const pk2 = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000002',
    'hex',
  );
  const pk3 = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000003',
    'hex',
  );

  const account1 = new DefaultAccount(pk1);
  const account2 = new DefaultAccount(pk2);
  const account3 = new DefaultAccount(pk3);

  const tx = await client.composeTransaction({
    serviceName: 'account',
    method: 'generate_account',
    payload: {
      accounts: [
        { address: account1.address, weight: 1 },
        { address: account2.address, weight: 1 },
        { address: account3.address, weight: 1 },
      ],
      threshold: 2,
    },
  });

  const signedTx = account1.signTransaction(tx);

  const txHash = await client.sendTransaction(signedTx);
  const receipt = await client.getReceipt(txHash);

  const succeedData = JSON.parse(receipt.response.response.succeedData);
  expect(Number(receipt.response.response.code)).toBe(0);
  expect(succeedData.address).toBeTruthy();

  const mulAccount = new DefaultMultiSigAccount(
    [pk1, pk3],
    succeedData.address,
  );

  const assetReceipt1 = await createAsset(mulAccount);
  expect(Number(assetReceipt1.response.response.code)).toBe(0);

  const mulAccount2 = new DefaultMultiSigAccount([pk1], succeedData.address);
  await expect(createAsset(mulAccount2)).rejects.toThrow();
});
