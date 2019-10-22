import { mnemonicToSeedSync, generateMnemonic } from 'bip39';
import * as HDKey from 'hdkey';
import { Wallet } from '..';

/**
 * HD Wallet, for more we can see
 * [bip32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki),
 * [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * and [bip44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 */
export class HDWallet implements Wallet {
  private readonly mnemonic: string;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
  }

  private static getHDPath(index: number): string {
    return `m/44'/60'/${index}'/0/0`;
  }

  /**
   * // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account
   * @param accountIndex
   */
  public getPrivateKey(accountIndex: number): Buffer {
    const seed = mnemonicToSeedSync(this.mnemonic);
    const hd = HDKey.fromMasterSeed(seed);
    const hdInstance = hd.derive(HDWallet.getHDPath(accountIndex));
    return hdInstance._privateKey;
  }

  public static fromMnemonic(mnemonic: string): HDWallet {
    return new HDWallet(mnemonic);
  }

  public static generateMnemonic() {
    return generateMnemonic();
  }
}
