import { Account } from '@mutadev/account';
import { Client } from '@mutadev/client';
import { BigNumber } from '@mutadev/shared';
import { AssetService } from './AssetService';

const account = new Account(
  '0x1000000000000000000000000000000000000000000000000000000000000000',
);

const client = new Client();

test('test AssetService', async () => {
  const service = new AssetService(client, account);

  const supply = 10000;

  await expect(() =>
    service.write.create_asset({
      name: '',
      supply: -1,
      symbol: '',
    }),
  ).rejects.toThrow();

  const res = await service.write.create_asset({
    name: Math.random().toString(),
    supply,
    symbol: Math.random().toString(),
  });

  const asset = res.response.response.succeedData;

  expect(Number(res.response.response.code)).toBe(0);
  expect(new BigNumber(asset.supply).eq(new BigNumber(supply))).toBe(true);

  await service.write.transfer({
    asset_id: asset.id,
    to: 'muta1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqggfy0d',
    value: 123,
  });

  const balanceRes = await service.read.get_balance({
    asset_id: asset.id,
    user: account.address,
  });

  expect(balanceRes.succeedData.balance).toBe(supply - 123);
});
