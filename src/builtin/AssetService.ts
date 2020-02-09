import BigNumber from 'bignumber.js';
import { Client } from '..';
import { Account } from '../account';
import { boom } from '../error';
import { Address, ExecRespDyn, Hash, Receipt, ServicePayload } from '../type';
import * as utils from '../utils';

export interface GetBalancePayParam {
  asset_id: string;
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
  asset_id: Hash;
  name: string;
  symbol: string;
  supply: number | BigNumber;
  issuer: Address;
}

export interface GetAssetParam {
  asset_id: Hash;
}

/**
 * Muta chain has many built-in services, you can leverage these built-in service and then compose your own service
 *
 * AssetService service is a template which provides you capability to manipulate
 * UDT(user defined token), which is non-distinguishable asset, in Muta chain, like ERC20 in Ethereum
 *
 * Here is an example:
 *
 * ```js
 * async funtion example(){
 * const supply = 22000000;
 * const createdAsset = await service.createAsset({
 *    name: Math.random().toString(),
 *   supply,
 *  symbol: Math.random().toString()
 * });
 *
 * const assetId = createdAsset.asset_id;
 *
 * const asset = await service.getAsset(assetId);
 *
 * const balance = await service.getBalance(assetId, account.address);
 *
 * const to = '0x2000000000000000000000000000000000000000';
 *
 * await service.transfer({
 *  asset_id: assetId,
 *  to,
 *  value: 500
 * });
 *
 * const balance2 = await service.getBalance(assetId, to);
 * t.is(balance2, 500);
 * }
 * ```
 */
export class AssetService {
  private client: Client;

  private account: Account;

  /**
   * create an Asset service,
   * if you want to send transaction like [[createAsset]] and [[transfer]] with another account,
   * please new an another AssetService
   * @param client the client which take responsibility of communicate to the chain
   * @param account the default address while send queries to the chain
   */
  constructor(client: Client, account: Account) {
    this.client = client;
    this.account = account;
  }

  /**
   * send a query to Muta to get the balance of target account's address in given asset
   * @param assetId the asset id of asset, you can [[createAsset]]
   * @param address optional, the address whose balance you want check, default is the address of [[Account]] you passed by Constructor
   */
  public async getBalance(
    assetId: string,
    address: string = this.account.address,
  ): Promise<number | BigNumber> {
    const servicePayload: ServicePayload<GetBalancePayParam> = {
      caller: address,
      method: 'get_balance',
      payload: { asset_id: assetId },
      serviceName: 'asset',
    };

    const res: ExecRespDyn<Balance> = await this.client.queryServiceDyn<
      GetBalancePayParam,
      Balance
    >(servicePayload);

    return res.ret.balance;
  }

  /**
   * send a transaction to transfer the given amount of given asset to given address from the **account created in Constructor**
   * @param payload give the asset, amount and to-address
   */
  public async transfer(payload: TransferPayParam): Promise<null> {
    const tx = await this.client.composeTransaction({
      method: 'transfer',
      payload,
      serviceName: 'asset',
    });

    const txHash = await this.client.sendTransaction(
      this.account.signTransaction(tx),
    );

    const receipt: Receipt = await this.client.getReceipt(utils.toHex(txHash));

    if (receipt.response.isError) {
      throw boom(`RPC error: ${receipt.response.ret}`);
    }

    return null;
  }

  /**
   * send a transaction to create an asset
   * all the info are in [[CreateAssetParam]]
   * the issuer is the **account created in Constructor**
   * @param payload
   */
  public async createAsset(payload: CreateAssetParam): Promise<Asset> {
    const tx = await this.client.composeTransaction({
      method: 'create_asset',
      payload,
      serviceName: 'asset',
    });

    const txHash = await this.client.sendTransaction(
      this.account.signTransaction(tx),
    );
    const receipt: Receipt = await this.client.getReceipt(utils.toHex(txHash));

    if (receipt.response.isError) {
      throw boom(`RPC error: ${receipt.response.ret}`);
    }

    let createdAssetResult = utils.safeParseJSON(receipt.response.ret);
    createdAssetResult = this.changeIdToAssetId(createdAssetResult);
    createdAssetResult = createdAssetResult as Asset;
    return createdAssetResult;
  }

  /**
   * send a query to Muta to get the info of target asset
   * @param assetId [[Hash]], asset_id, you can get when you [[createAsset]]
   * @param address the default query sender, this should be useless in this query
   */
  public async getAsset(
    assetId: Hash,
    address: string = this.account.address,
  ): Promise<Asset> {
    const servicePayload: ServicePayload<GetAssetParam> = {
      caller: address,
      method: 'get_asset',
      payload: this.changeAssetIdToId({ asset_id: assetId }),
      serviceName: 'asset',
    };

    const res: ExecRespDyn<Asset> = await this.client.queryServiceDyn<
      GetAssetParam,
      Asset
    >(servicePayload);

    return this.changeIdToAssetId(res.ret);
  }

  // wrapper all 'id' field under Asset Service to 'asset_id'
  private changeIdToAssetId(input: any) {
    if (input.hasOwnProperty('id')) {
      input.asset_id = input.id;
      delete input.id;
    }
    return input;
  }

  private changeAssetIdToId(input: any) {
    if (input.hasOwnProperty('asset_id')) {
      input.id = input.asset_id;
      delete input.asset_id;
    }
    return input;
  }
}
