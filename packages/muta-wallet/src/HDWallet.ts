import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import HDKey from 'hdkey';
import { Account } from '@mutajs/account';
import { toHex } from '@mutajs/utils';
import { SyncWallet } from './SyncWallet';

export const COIN_TYPE = 918;

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

  private static getHDPath(accountIndex: number): string {
    return `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`;
  }

  private readonly mnemonic: string;
  private readonly masterNode: HDKey;

  /**
   * generate an HDWallet from given mnemonic
   * @param mnemonic string, 12 English word split by space
   */
  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
    const seed = mnemonicToSeedSync(this.mnemonic);
    this.masterNode = HDKey.fromMasterSeed(seed);
  }

  /**
   * Get the private key with accountIndex in the `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`
   * https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account
   * @param accountIndex the accountIndex in the Path, please refer to bip-0044
   */
  public derivePrivateKey(accountIndex: number): Buffer {
    const hdNode = this.masterNode.derive(HDWallet.getHDPath(accountIndex));
    return hdNode.privateKey;
  }

  /**
   * Get the Account with with accountIndex in the `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`
   * the private key is in the return [[Account]]
   * @param accountIndex the accountIndex in the Path, please refer to bip-0044
   */
  public deriveAccount(accountIndex: number): Account {
    return Account.fromPrivateKey(toHex(this.derivePrivateKey(accountIndex)));
  }
}
