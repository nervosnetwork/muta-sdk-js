import { Account } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { BigNumber } from '@mutajs/shared';
import test from 'ava';
import { AssetService } from './AssetService';

const account = Account.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);

const client = new Client();

test('test AssetService', async t => {
  const service = new AssetService(client, account);

  const supply = 10000;
  const res = await service.create_asset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString(),
  });

  const asset = res.response.response.succeedData;

  t.is(Number(res.response.response.code), 0);
  t.true(new BigNumber(asset.supply).eq(new BigNumber(supply)));

  await service.transfer({
    asset_id: asset.id,
    to: '0x0000000000000000000000000000000000000000',
    value: 123,
  });

  const balanceRes = await service.get_balance({
    asset_id: asset.id,
    user: account.address,
  });

  t.is(balanceRes.succeedData.balance, supply - 123);
});
