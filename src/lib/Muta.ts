import { Client } from '..';
import { HDWallet } from '../wallet';
import { SyncAccount } from '../account';

interface MutaContext {
  chainId: string;
  endpoint: string;
}

/**
 *
 */
export class Muta {
  private readonly context: MutaContext;

  constructor(context: MutaContext) {
    this.context = context;
  }

  get client(): Client {
    const { endpoint, chainId } = this.context;
    return new Client(endpoint, chainId);
  }

  public hdWalletFromMnemonic(mnemonic: string): HDWallet {
    return HDWallet.fromMnemonic(mnemonic);
  }

  public accountFromPrivateKey(privateKey: string): SyncAccount {
    return SyncAccount.fromPrivateKey(privateKey);
  }
}
