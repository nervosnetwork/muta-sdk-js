import {
  createServiceClass,
  read,
  write,
  Address,
  Hash,
  String,
  u64,
} from '../';

const CreateAssetPayload = {
  name: String,
  symbol: String,
  supply: u64,
};

const GetAssetPayload = {
  id: Hash,
};

const TransferPayload = {
  asset_id: Hash,
  to: Address,
  value: u64,
};

const ApprovePayload = TransferPayload;

const TransferFromPayload = {
  asset_id: Hash,
  sender: Address,
  recipient: Address,
  value: u64,
};

const GetBalancePayload = {
  asset_id: Hash,
  user: Address,
};

const GetBalanceResponse = {
  asset_id: Hash,
  user: Address,
  balance: u64,
};

const GetAllowancePayload = {
  asset_id: Hash,
  grantor: Address,
  grantee: Address,
};

const GetAllowanceResponse = {
  asset_id: Hash,
  grantor: Address,
  grantee: Address,
  value: u64,
};

const Asset = {
  id: Hash,
  name: String,
  symbol: String,
  supply: u64,
  issuer: Address,
};

export const AssetService = createServiceClass('asset', {
  get_asset: read(GetAssetPayload, Asset),
  get_balance: read(GetBalancePayload, GetBalanceResponse),
  get_allowance: read(GetAllowancePayload, GetAllowanceResponse),

  create_asset: write(CreateAssetPayload, Asset),
  transfer: write(TransferPayload, null),
  approve: write(ApprovePayload, null),
  transfer_from: write(TransferFromPayload, null),
});
