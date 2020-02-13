import test from 'ava';
import { BigNumber } from 'bignumber.js';
import { Muta } from '../Muta';
import { rm0x } from '../utils';
import { AssetService } from './AssetService';

const muta = Muta.createDefaultMutaInstance();

const client = muta.client();
const account = Muta.accountFromPrivateKey(
  '0x1000000000000000000000000000000000000000000000000000000000000000',
);

test('AssetServiceTs with binding', async t => {
  const service = new AssetService(client, account);

  const supply = new BigNumber('9223372036854775808'); // 1 << 63

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
    asset_id: assetId,
    user: createdAsset.issuer,
  });
  t.true(supply.isEqualTo(balance));

  const to = '0x2000000000000000000000000000000000000000';

  await service.transfer({
    asset_id: assetId,
    to,
    value: 500,
  });

  const {
    ret: { balance: balance2 },
  } = await service.get_balance({
    asset_id: assetId,
    user: to,
  });
  t.is(balance2, 500);
});
