import { Account } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { BigNumber } from '@mutajs/shared';
import { Address, Hash, u64 } from '@mutajs/types';
import { createBindingClass } from './binding';
import { mutation, query } from './hook';

interface CreateAssetPayload {
  name: string;
  symbol: string;
  supply: u64;
}

interface GetAssetPayload {
  id: Hash;
}

interface TransferPayload {
  asset_id: Hash;
  to: Address;
  value: u64;
}

type ApprovePayload = TransferPayload;

interface TransferFromPayload {
  asset_id: Hash;
  sender: Address;
  recipient: Address;
  value: u64;
}

interface GetBalancePayload {
  asset_id: Hash;
  user: Address;
}

interface GetBalanceResponse {
  asset_id: Hash;
  user: Address;
  balance: u64;
}

interface GetAllowancePayload {
  asset_id: Hash;
  grantor: Address;
  grantee: Address;
}

interface GetAllowanceResponse {
  asset_id: Hash;
  grantor: Address;
  grantee: Address;
  value: u64;
}

interface Asset {
  id: Hash;
  name: string;
  symbol: string;
  supply: u64;
  issuer: Address;
}

const AssetService = createBindingClass(
  'asset',
  {
    get_asset: query<GetAssetPayload, Asset>(),
    get_balance: query<GetBalancePayload, GetBalanceResponse>(),
    get_allowance: query<GetAllowancePayload, GetAllowanceResponse>(),
  },
  {
    create_asset: mutation<CreateAssetPayload, Asset>(),
    transfer: mutation<TransferPayload, {}>(),
    approve: mutation<ApprovePayload, {}>(),
    transfer_from: mutation<TransferFromPayload, {}>(),
  },
);

const account = Account.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);

const client = new Client();

it('e2e test createBindingClass', async () => {
  const service = new AssetService(client, account);

  const supply = 10000;
  const res = await service.mutation.create_asset({
    name: Math.random().toString(),
    supply,
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
