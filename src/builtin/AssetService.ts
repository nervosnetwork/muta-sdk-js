import { Client } from '..';
import { SyncAccount } from '../account';

interface GetBalancePayload {
  asset_id: string;
}

interface GetBalanceRet {
  asset_id: string;
  balance: number;
}

interface TransferPayload {
  asset_id: Hash;
  to: Address;
  value: number;
}

interface CreateAssetPayload {
  name: string;
  symbol: string;
  supply: number;
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
    const res = await this.client.queryService<
      GetBalanceRet,
      GetBalancePayload
    >({
      caller: address,
      method: 'get_balance',
      payload: { asset_id: assetId },
      serviceName: 'asset'
    });

    return res.ret.balance;
  }

  public async transfer(payload: TransferPayload): Promise<string> {
    const tx = await this.client.prepareTransaction({
      method: 'transfer',
      payload,
      serviceName: 'asset'
    });

    return this.client.sendTransaction(this.account.signTransaction(tx));
  }

  public async createAsset(payload: CreateAssetPayload) {
    const tx = await this.client.prepareTransaction({
      method: 'create_asset',
      payload,
      serviceName: 'asset'
    });

    return this.client.sendTransaction(this.account.signTransaction(tx));
  }
}
