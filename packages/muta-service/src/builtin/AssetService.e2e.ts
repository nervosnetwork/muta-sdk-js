import { DefaultAccount } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { BigNumber } from '@mutajs/shared';
import { randomHex } from '@mutajs/utils';
import { AssetService } from './AssetService';

const account = DefaultAccount.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);

const client = new Client();

test('test AssetService', async () => {
  const service = new AssetService(client, account);

  const supply = 10000;
  const res = await service.mutation.create_asset({
    name: Math.random().toString(),
    supply: supply,
    symbol: Math.random().toString(),
  });

  const asset = res.response.response.succeedData;

  expect(Number(res.response.response.code)).toBe(0);
  expect(new BigNumber(asset.supply).eq(new BigNumber(supply))).toBe(true);

  await service.mutation.transfer({
    asset_id: asset.id,
    to: '0x0000000000000000000000000000000000000000',
    value: 123,
  });

  const balanceRes = await service.query.get_balance({
    asset_id: asset.id,
    user: account.address,
  });

  expect(balanceRes.succeedData.balance).toBe(supply - 123);
});

test('failed query', async () => {
  const service = new AssetService(client, null);
  const asset = await service.query.get_asset({
    id: randomHex(64),
  });

  expect(Number(asset.code) !== 0).toBe(true);
});

test('mutation failed', async () => {
  const service = new AssetService(client, account);

  const supply = new BigNumber('18446744073709551617'); // (1 << 65) + 1
  const res = await service.mutation.create_asset({
    name: Math.random().toString(),
    supply: supply,
    symbol: Math.random().toString(),
  });

  expect(Number(res.response.response.code) !== 0).toBe(true);
});
