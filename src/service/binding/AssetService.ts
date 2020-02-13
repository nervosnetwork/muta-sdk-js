// https://github.com/HuobiGroup/huobi-chain/tree/master/services/asset

/* step 1. import the necessary binding helper */
import { createBindingClass, read, Read, write, Write } from '../';
import { Address, Hash, u64 } from '../../type';

/* step 2. convert the struct of the payload from Rust to Typescript */

export interface GetBalancePayParam {
  asset_id: Hash;
  user: Address;
}

export interface GetBalanceResponse {
  asset_id: string;
  balance: u64;
}

export interface TransferPayParam {
  asset_id: Hash;
  to: Address;
  value: u64;
}

/**
 * name, give a name for your asset
 * symbol, give a **unique**symbol for your asset
 * supply, give a total supply for your asset
 */
export interface CreateAssetPayload {
  name: string;
  symbol: string;
  supply: u64;
}

/**
 * **asset_id**, the unique id of this asset, this is the main identifier for Asset Service to identify different Assets
 * name, name for your asset
 * symbol, **unique** symbol for your asset
 * supply, total supply for your asset
 * issuer, who creates this asset
 */
export interface Asset {
  id: Hash;
  name: string;
  symbol: string;
  supply: u64;
  issuer: Address;
}

export interface GetAssetPayload {
  id: Hash;
}

export interface ApprovePayload {
  asset_id: Hash;
  to: Address;
  value: u64;
}

export interface TransferFromPayload {
  asset_id: Hash;
  sender: Address;
  recipient: Address;
  value: u64;
}

export interface GetAllowancePayload {
  asset_id: Hash;
  grantor: Address;
  grantee: Address;
}

export interface GetAllowanceResponse {
  asset_id: Hash;
  grantor: Address;
  grantee: Address;
  value: u64;
}

/* step 3. Define the service name */
const serviceName = 'asset';

/* step 4. Define the Read and Write service method */
export interface AssetServiceModel {
  create_asset: Write<CreateAssetPayload, Asset>;
  get_allowance: Read<GetAllowancePayload, GetAllowanceResponse>;
  get_asset: Read<GetAssetPayload, Asset>;
  get_balance: Read<GetBalancePayParam, GetBalanceResponse>;
  transfer: Write<TransferPayParam>;
  approve: Write<ApprovePayload>;
  transfer_from: Write<TransferFromPayload>;
}

/* step 5. Create our binding and export it */
export const AssetService = createBindingClass<AssetServiceModel>(serviceName, {
  approve: write(),
  create_asset: write(),
  get_allowance: read(),
  get_asset: read(),
  get_balance: read(),
  transfer: write(),
  transfer_from: write(),
});
