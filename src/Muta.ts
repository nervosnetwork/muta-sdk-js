import { SyncAccount } from './account';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP
} from './constant/constant';
import { Client } from './index';
import * as util from './utils';
import { HDWallet } from './wallet';

interface MutaContext {
  /**
   * for more information about ChainID proposal,
   * look at [eip155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)
   */
  chainId: string;
  /**
   * a [GraplQL](https://graphql.org/) endpoint of remote node, ie. http://127.0.0.1:8000/graphql
   */
  endpoint: string;
  /**
   * defaults to 20. {@link DEFAULT_TIMEOUT_GAP}
   */
  timeoutGap?: number;
}

/**
 * Main module of the SDK
 */
export class Muta {

  get client(): Client {
    return this.rpcClient;
  }

  public static util = util ;
  /**
   * create a HD wallet from mnemonic. Now Muta positioning for a block chain framework,
   * so the wallet seems to be not a must
   * @deprecated
   * @param mnemonic 12 mnemonic words
   */
  public static hdWalletFromMnemonic(mnemonic: string): HDWallet {
    return HDWallet.fromMnemonic(mnemonic);
  }

  /**
   * create a account from private key
   * @param privateKey
   */
  public static accountFromPrivateKey(privateKey: string): SyncAccount {
    return SyncAccount.fromPrivateKey(privateKey);
  }

  public static createDefaultMutaInstance() {
    return new Muta({
      chainId:
        '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
      endpoint: 'http://127.0.0.1:8000/graphql'
    });
  }

  private readonly context: MutaContext;
  private readonly rpcClient: Client;

  constructor(context: MutaContext) {
    this.context = {
      chainId: context.chainId,
      endpoint: context.endpoint,
      timeoutGap: DEFAULT_TIMEOUT_GAP
    };

    const { endpoint, chainId } = this.context;
    this.rpcClient = new Client({
      chainId,
      entry: endpoint,
      maxTimeout: DEFAULT_TIMEOUT_GAP * DEFAULT_CONSENSUS_INTERVAL
    });
  }
}

