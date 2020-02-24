import { Client } from './';
import { Account } from './account';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP,
} from './constant/constant';
import { Client } from './index';
import { Uint64 } from './types';
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
   * defaults to {@link DEFAULT_TIMEOUT_GAP}. The {@link Transaction.timeout} in {@link Transaction}
   * parameter indicates the maximum waiting block height fot the transaction.
   * and `timeoutGap + currentBlockHeight` is the maximum value of this value
   */
  timeoutGap?: number;

  /**
   * defaults to {@link DEFAULT_CONSENSUS_INTERVAL}, block interval
   */
  consensusInterval?: number;
}

/**
 * all in one module, use it to interact with muta,
 * and can be used to create wallets, accounts, etc.
 */
export class Muta {
  public static hdWallet = HDWallet;
  public static account = Account;

  /**
   * create a HD wallet from mnemonic.
   * the HD path is set to `m/44'/${COIN_TYPE}'/${index}'/0/0`
   * {@link COIN_TYPE}
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
   * chainId is set to {@link DEFAULT_CHAIN_ID}
   * endpoint is set to {@link DEFAULT_ENDPOINT},
   * timeoutGap is set to {@link DEFAULT_TIMEOUT_GAP}
   */
  public static createDefaultMutaInstance() {
    return new Muta({});
  }
  private readonly context: MutaContext;

  /**
   * construct a Muta object
   * @param context
   */
  constructor(context: MutaContext) {
    this.context = {
      chainId: DEFAULT_CHAIN_ID,
      consensusInterval: DEFAULT_CONSENSUS_INTERVAL,
      endpoint: DEFAULT_ENDPOINT,
      timeoutGap: DEFAULT_TIMEOUT_GAP,
      ...context,
    };
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
      consensusInterval: this.context.consensusInterval,
      defaultCyclesLimit,
      defaultCyclesPrice,
      endpoint: this.context.endpoint,
      maxTimeout: this.context.timeoutGap * DEFAULT_CONSENSUS_INTERVAL,
      timeoutGap: this.context.timeoutGap,
    });
  }
}
