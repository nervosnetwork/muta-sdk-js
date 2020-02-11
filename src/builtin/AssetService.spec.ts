import test from 'ava';
import BigNumber from 'bignumber.js';
import { Muta } from '../Muta';
import { rm0x } from '../utils';
import { AssetService } from './AssetService';

const muta = Muta.createDefaultMutaInstance();

const client = muta.client();
const account = Muta.accountFromPrivateKey(
  '0x1000000000000000000000000000000000000000000000000000000000000000',
);
const service = new AssetService(client, account);

test.skip('a fully AssetService example', async t => {
  /* create UDT */
  const supply = 22000000;

  const createdAsset = await service.createAsset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString(),
  });

  t.is(createdAsset.issuer, rm0x(account.address));

  const assetId = createdAsset.asset_id;

  const asset = await service.getAsset(assetId);
  t.is(asset.asset_id, assetId);

  const balance = await service.getBalance(assetId, account.address);
  t.is(balance, supply);

  const to = '0x2000000000000000000000000000000000000000';

  await service.transfer({
    asset_id: assetId,
    to,
    value: 500,
  });

  const balance2 = await service.getBalance(assetId, to);
  t.is(balance2, 500);
});

test.skip('Big supply', async t => {
  const createdAsset = await service.createAsset({
    name: Math.random().toString(),
    supply: new BigNumber('9007199254740993'),
    symbol: Math.random().toString(),
  });

  const supply = createdAsset.supply;
  t.true(BigNumber.isBigNumber(supply));
  t.true(new BigNumber(supply).isEqualTo('9007199254740993'));

  const balance = await service.getBalance(
    createdAsset.asset_id,
    account.address,
  );
  t.true(new BigNumber(balance).isEqualTo('9007199254740993'));

  await service.transfer({
    asset_id: createdAsset.asset_id,
    to: '0x2000000000000000000000000000000000000000',
    value: 500,
  });

  const balance2 = await service.getBalance(
    createdAsset.asset_id,
    account.address,
  );
  t.true(
    new BigNumber(balance2).isEqualTo(
      new BigNumber('9007199254740993').minus(500),
    ),
  );
});
