import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import * as HDKey from 'hdkey';
import { SyncWallet } from '..';
import { SyncAccount } from '../account';
import { COIN_TYPE } from '../core/constant';
import { toHex } from '../utils';

/**
 * HD Wallet, for more information see
 * [bip32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki),
 * [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * and [bip44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 */
export class HDWallet implements SyncWallet {
  public static fromMnemonic(mnemonic: string): HDWallet {
    return new HDWallet(mnemonic);
  }

  public static generateMnemonic() {
    return generateMnemonic();
  }

  private static getHDPath(index: number): string {
    return `m/44'/${COIN_TYPE}'/${index}'/0/0`;
  }
  private readonly mnemonic: string;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
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

  public accountByIndex(index: number): SyncAccount {
    return SyncAccount.fromPrivateKey(toHex(this.getPrivateKey(index)));
  }
}
