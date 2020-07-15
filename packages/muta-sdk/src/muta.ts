import { Account } from '@mutadev/account';
import { Client } from '@mutadev/client';
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_ENDPOINT,
  DEFAULT_TIMEOUT_GAP,
} from '@mutadev/defaults';
import { Uint64 } from '@mutadev/types';
import { HDWallet } from '@mutadev/wallet';
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
 * DEPRECATED: please use `import { Client, Account } from '@mutadev/muta-sdk'`
 * to instead
 * @deprecated
 */
export class Muta {
  /**
   * @deprecated
   */
  public static hdWallet = HDWallet;
  /**
   * @deprecated
   */
  public static account = Account;
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
   * @deprecated
   */
  public static accountFromPrivateKey(privateKey: string): Account {
    return Account.fromPrivateKey(privateKey);
  }

  /**
   * get a [[Client]] for communication with chain thru Muta node
   * @deprecated
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
