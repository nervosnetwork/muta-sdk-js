import { Account } from './account';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP,
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
  public static util = util;
  public static hdWallet = HDWallet;
  public static account = Account;
  /**
   * create a HD wallet from mnemonic.
   * the HD path is set to `m/44'/${COIN_TYPE}'/${index}'/0/0`
   * [[COIN_TYPE]] is 918
   * @param mnemonic 12 mnemonic words split by space
   */
  public static hdWalletFromMnemonic(mnemonic: string): HDWallet {
    return new HDWallet(mnemonic);
  }

  /**
   * create an Account directly from private key
   * @param privateKey
   */
  public static accountFromPrivateKey(privateKey: string): Account {
    return Account.fromPrivateKey(privateKey);
  }

  /**
   * create a default Muta Instance
   * chainId is set to '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036'
   * endpoint is set to 'http://127.0.0.1:8000/graphql',
   * timeoutGap is set to [[DEFAULT_TIMEOUT_GAP]]
   */
  public static createDefaultMutaInstance() {
    return new Muta({
      chainId:
        '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
      endpoint: 'http://127.0.0.1:8000/graphql',
      timeoutGap: DEFAULT_TIMEOUT_GAP,
    });
  }

  private readonly context: MutaContext;

  /**
   * construct a Muta object
   * @param context
   */
  constructor(context: MutaContext) {
    this.context = { timeoutGap: DEFAULT_TIMEOUT_GAP, ...context };
  }

  /**
   * get a [[Client]] for communication with chain thru Muta node
   * @param defaultCyclesLimit
   * @param defaultCyclesPrice
   */
  public client(
    defaultCyclesLimit: Uint64 = '0xffff',
    defaultCyclesPrice: Uint64 = '0xffff',
  ): Client {
    return new Client({
      chainId: this.context.chainId,
      defaultCyclesLimit,
      defaultCyclesPrice,
      endpoint: this.context.endpoint,
      maxTimeout: this.context.timeoutGap * DEFAULT_CONSENSUS_INTERVAL,
    });
  }
}
