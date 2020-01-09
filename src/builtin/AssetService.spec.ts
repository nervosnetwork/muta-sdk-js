import test from 'ava';
import { rm0x, toHex } from '../utils';
import { AssetService } from './AssetService';
import { getDefaultMutaInstance } from './index';

const muta = getDefaultMutaInstance();
const client = muta.client;
const account = muta.accountFromPrivateKey(
  '0x1000000000000000000000000000000000000000000000000000000000000000'
);
const service = new AssetService(client, account);

test('a fully example', async t => {
  /* create UDT */
  const supply = 22000000;

  const txHash = await service.createAsset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString()
  });

  const receipt = await client.getReceipt(toHex(txHash));
  const createdAsset = JSON.parse(receipt);
  t.is(createdAsset.owner, rm0x(account.address));

  const assetId = createdAsset.id;
  const balance = await service.getBalance(assetId, account.address);
  t.is(balance, supply);

  const to = '0x2000000000000000000000000000000000000000';
  const transferHash = await service.transfer({
    asset_id: assetId,
    to,
    value: 500
  });
  await client.getReceipt(transferHash);
  const balance2 = await service.getBalance(assetId, to);
  t.is(balance2, 500);
});
