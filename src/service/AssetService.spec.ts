import test from 'ava';
import { Muta } from '../Muta';
import { rm0x } from '../utils';
import { AssetService } from './AssetService';

const muta = Muta.createDefaultMutaInstance();

const client = muta.client();
const account = Muta.accountFromPrivateKey(
  '0x1000000000000000000000000000000000000000000000000000000000000000',
);

test.only('AssetService with binding', async t => {
  const service = new AssetService(client, account);

  const supply = 22000000;

  const receipt = await service.create_asset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString(),
  });

  const createdAsset = receipt.response.ret;

  t.is(createdAsset.issuer, rm0x(account.address));
  const assetId = createdAsset.id;

  const {
    ret: { balance },
  } = await service.get_balance({
    address: createdAsset.issuer,
    asset_id: assetId,
  });
  t.is(balance, supply);

  const to = '0x2000000000000000000000000000000000000000';

  await service.transfer({
    asset_id: assetId,
    to,
    value: 500,
  });

  const {
    ret: { balance: balance2 },
  } = await service.get_balance({
    address: to,
    asset_id: assetId,
  });
  t.is(balance2, 500);
});
