import { Client } from '..';
import { SyncAccount } from '../account';
import { Address, ExecRespDyn, Hash, Receipt, ServicePayload } from '../type';
import * as utils from '../utils';

export interface GetBalancePayParam {
  asset_id: string;
}

export interface Balance {
  asset_id: string;
  balance: number;
}

export interface TransferPayParam {
  asset_id: Hash;
  to: Address;
  value: number;
}

export interface CreateAssetParam {
  name: string;
  symbol: string;
  supply: number;
}

export interface Asset {
  asset_id: Hash;
  name: string;
  symbol: string;
  supply: number;
  issuer: Address;
}

export interface GetAssetParam {
  asset_id: Hash;
}

export class AssetService {
  private client: Client;

  private account: SyncAccount;

  constructor(client: Client, account: SyncAccount) {
    this.client = client;
    this.account = account;
  }

  public async getBalance(
    assetId: string,
    address: string = this.account.address
  ): Promise<number> {
    const servicePayload: ServicePayload<GetBalancePayParam> = {
      caller: address,
      method: 'get_balance',
      payload: { asset_id: assetId },
      serviceName: 'asset'
    };

    const res: ExecRespDyn<Balance> = await this.client.queryServiceDyn<
      GetBalancePayParam,
      Balance
    >(servicePayload);

    return res.ret.balance;
  }

  public async transfer(payload: TransferPayParam): Promise<string> {
    const tx = await this.client.prepareTransaction({
      method: 'transfer',
      payload,
      serviceName: 'asset'
    });

    return this.client.sendTransaction(this.account.signTransaction(tx));
  }

  /*  public async createAsset(payload: CreateAssetParam) {
    const tx = await this.client.prepareTransaction({
      method: 'create_asset',
      payload,
      serviceName: 'asset'
    });

    return this.client.sendTransaction(this.account.signTransaction(tx));
  }*/

  public async createAsset(payload: CreateAssetParam): Promise<Asset> {
    const tx = await this.client.prepareTransaction({
      method: 'create_asset',
      payload,
      serviceName: 'asset'
    });

    const txHash = await this.client.sendTransaction(
      this.account.signTransaction(tx)
    );
    const receipt: Receipt = await this.client.getReceipt(utils.toHex(txHash));

    let createdAssetResult = JSON.parse(receipt.response.ret);
    createdAssetResult = this.changeIdToAssetId(createdAssetResult);
    createdAssetResult = createdAssetResult as Asset;
    return createdAssetResult;
  }

  public async getAsset(
    assetId: Hash,
    address: string = this.account.address
  ): Promise<Asset> {
    const servicePayload: ServicePayload<GetAssetParam> = {
      caller: address,
      method: 'get_balance',
      payload: { asset_id: assetId },
      serviceName: 'asset'
    };

    const res: ExecRespDyn<Asset> = await this.client.queryServiceDyn<
      GetAssetParam,
      Asset
    >(servicePayload);

    return res.ret;
  }

  // wrapper all 'id' field under Asset Service to 'asset_id'
  private changeIdToAssetId(input: any) {
    if (input.hasOwnProperty('id')) {
      input.asset_id = input.id;
      delete input.id;
    }
    return input;
  }
}
