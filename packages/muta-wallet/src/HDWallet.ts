import { Account } from '@mutadev/account';
import { toHex } from '@mutadev/utils';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import HDKey from 'hdkey';
import { SyncWallet } from './SyncWallet';

export const DEFAULT_COIN_TYPE = 918;

export interface HDWalletOptions {
  coinType?: number;
}

/**
 * An HDWallet inside Muta JS SDK.
 * Nothing special like other HDWallets.
 *
 * for more information see
 * [bip32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki),
 * [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * [bip44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 *
 * Here is an example
 * ```js
 * function example(){
 *    // use HDWallet to generate random mnemonic
 *    const mnemonic = Muta.hdWallet.generateMnemonic();
 *
 *    // use the mnemonic to build an HDWallet
 *    const wallet = new Muta.hdWallet(mnemonic);
 *
 *    // derive an account from the HDWallet
 *    const account = wallet.deriveAccount(1);
 * }
 * ```
 */
export class HDWallet implements SyncWallet {
  /**
   * generate random mnemonic phrases
   */
  public static generateMnemonic(): string {
    return generateMnemonic();
  }

  private static getHDPath(
    accountIndex: number,
    coinType = DEFAULT_COIN_TYPE,
  ): string {
    return `m/44'/${coinType}'/${accountIndex}'/0/0`;
  }

  readonly #masterNode: HDKey;
  private readonly coinType: number;

  /**
   * generate an HDWallet from given mnemonic
   * @param mnemonic string, 12 English word split by space
   * @param options
   */
  constructor(mnemonic: string, options?: HDWalletOptions) {
    const seed = mnemonicToSeedSync(mnemonic);
    this.#masterNode = HDKey.fromMasterSeed(seed);
    this.coinType = options?.coinType ?? DEFAULT_COIN_TYPE;
  }

  /**
   * Get the private key with accountIndex in the `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`
   * https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account
   * @param accountIndex the accountIndex in the Path, please refer to bip-0044
   */
  public derivePrivateKey(accountIndex: number): Buffer {
    const hdPath = HDWallet.getHDPath(accountIndex, this.coinType);
    const hdNode = this.#masterNode.derive(hdPath);
    return hdNode.privateKey;
  }

  /**
   * Get the Account with with accountIndex in the `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`
   * the private key is in the return {@link Account}
   * @param accountIndex the accountIndex in the Path, please refer to bip-0044
   */
  public deriveAccount(accountIndex: number): Account {
    return Account.fromPrivateKey(toHex(this.derivePrivateKey(accountIndex)));
  }
}
