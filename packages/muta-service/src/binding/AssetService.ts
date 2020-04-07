import { Address, Hash, u64 } from '@mutajs/types';
import { createBindingClass, read, Read, write, Write } from '../binding';

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

export interface AssetServiceModel {
  get_asset: Read<GetAssetPayload, Asset>;
  get_balance: Read<GetBalancePayload, GetBalanceResponse>;
  get_allowance: Read<GetAllowancePayload, GetAllowanceResponse>;
  create_asset: Write<CreateAssetPayload, Asset>;
  transfer: Write<TransferPayload, ''>;
  approve: Write<ApprovePayload, ''>;
  transfer_from: Write<TransferFromPayload, ''>;
}

export const AssetService = createBindingClass<AssetServiceModel>('asset', {
  approve: write(),
  create_asset: write(),
  get_allowance: read(),
  get_asset: read(),
  get_balance: read(),
  transfer: write(),
  transfer_from: write(),
});
