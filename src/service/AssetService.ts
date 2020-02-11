import BigNumber from 'bignumber.js';
import { Address, Hash } from '../type';
import { createBindingClass, read, Read, write, Write } from './';

export interface GetBalancePayParam {
  asset_id: string;
  user: Address;
}

export interface Balance {
  asset_id: string;
  balance: number | BigNumber;
}

export interface TransferPayParam {
  asset_id: Hash;
  to: Address;
  value: number | BigNumber;
}

/**
 * name, give a name for your asset
 * symbol, give a **unique**symbol for your asset
 * supply, give a total supply for your asset
 */
export interface CreateAssetParam {
  name: string;
  symbol: string;
  supply: number | BigNumber;
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
  supply: number | BigNumber;
  issuer: Address;
}

export interface GetAssetParam {
  asset_id: Hash;
}

interface AssetServiceModel {
  create_asset: Write<CreateAssetParam, Asset>;
  get_balance: Read<GetBalancePayParam, Balance>;
  transfer: Write<TransferPayParam>;
}

const serviceName = 'asset';

export const AssetService = createBindingClass<AssetServiceModel>(serviceName, {
  create_asset: write(),
  get_balance: read(),
  transfer: write(),
});
