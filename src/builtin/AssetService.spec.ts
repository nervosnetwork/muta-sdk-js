import test from 'ava';
import { Muta } from '../Muta';
import { rm0x } from '../utils';
import { AssetService } from './AssetService';

const muta = Muta.createDefaultMutaInstance();

const client = muta.client;
const account = Muta.accountFromPrivateKey(
  '0x1000000000000000000000000000000000000000000000000000000000000000'
);
const service = new AssetService(client, account);

test('a fully AssetService example', async t => {
  /* create UDT */
  const supply = 22000000;

  const createdAsset = await service.createAsset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString()
  });

  t.is(createdAsset.issuer, rm0x(account.address));

  const assetId = createdAsset.asset_id;

  const asset = await service.getAsset(assetId);
  t.is(asset.asset_id, assetId);

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
