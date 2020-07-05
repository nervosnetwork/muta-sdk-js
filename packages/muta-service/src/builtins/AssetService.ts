import { Address, Hash, u64 } from '@mutadev/types';
import { createServiceBindingClass, read, write } from '../create';

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

export const AssetService = createServiceBindingClass({
  serviceName: 'asset',
  read: {
    get_asset: read<GetAssetPayload, Asset>(),
    get_balance: read<GetBalancePayload, GetBalanceResponse>(),
    get_allowance: read<GetAllowancePayload, GetAllowanceResponse>(),
  },
  write: {
    create_asset: write<CreateAssetPayload, Asset>(),
    transfer: write<TransferPayload, null>(),
    approve: write<ApprovePayload, null>(),
    transfer_from: write<TransferFromPayload, null>(),
  },
});

