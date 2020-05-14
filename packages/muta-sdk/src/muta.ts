import { DefaultAccount } from '@mutajs/account';
import { Client } from '@mutajs/client';
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_ENDPOINT,
  DEFAULT_TIMEOUT_GAP,
} from '@mutajs/defaults';
import { Uint64 } from '@mutajs/types';
import { HDWallet } from '@mutajs/wallet';
import { Optional } from 'utility-types';

export interface MutaContext {
  /**
   * for more information about ChainID proposal,
   * look at [eip155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)
   */
  chainId: string;
  /**
   * a [GraphQL](https://graphql.org/) endpoint of remote node, i.e. http://127.0.0.1:8000/graphql
   */
  endpoint: string;
  /**
   * defaults to {@link DEFAULT_TIMEOUT_GAP}. The {@link Transaction.timeout} in {@link Transaction}
   * parameter indicates the maximum waiting block height fot the transaction.
   * and `timeoutGap + currentBlockHeight` is the maximum value of this value
   */
  timeoutGap: number;

  /**
   * defaults to {@link DEFAULT_CONSENSUS_INTERVAL}, block interval
   */
  consensusInterval: number;
}

/**
 * all in one module, use it to interact with muta,
 * and can be used to create wallets, accounts, etc.
 */
export class Muta {
  public static hdWallet = HDWallet;
  public static account = DefaultAccount;
  private readonly context: MutaContext;

  /**
   * construct a Muta object
   * @param context
   */
  constructor(context: Optional<MutaContext> = {}) {
    this.context = {
      chainId: DEFAULT_CHAIN_ID,
      consensusInterval: DEFAULT_CONSENSUS_INTERVAL,
      endpoint: DEFAULT_ENDPOINT,
      timeoutGap: DEFAULT_TIMEOUT_GAP,
      ...context,
    };
  }

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
  public static accountFromPrivateKey(privateKey: string): DefaultAccount {
    return DefaultAccount.fromPrivateKey(privateKey);
  }

  /**
   * DEPRECATED, try `new Muta();`
   * create a default Muta Instance
   * chainId is set to {@link DEFAULT_CHAIN_ID}
   * endpoint is set to {@link DEFAULT_ENDPOINT},
   * timeoutGap is set to {@link DEFAULT_TIMEOUT_GAP}
   * @deprecated
   */
  public static createDefaultMutaInstance() {
    return new Muta({});
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
    const { endpoint, chainId, consensusInterval, timeoutGap } = this.context;

    return new Client({
      chainId,
      consensusInterval,
      defaultCyclesLimit,
      defaultCyclesPrice,
      endpoint,
      maxTimeout: this.context.timeoutGap * this.context.consensusInterval,
      timeoutGap,
    });
  }
}
