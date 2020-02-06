import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import * as HDKey from 'hdkey';
import { SyncAccount } from '../account';
import { COIN_TYPE } from '../constant/constant';
import { toHex } from '../utils';
import { SyncWallet } from './SyncWallet';

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
  private readonly masterNode: HDKey;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
    const seed = mnemonicToSeedSync(this.mnemonic);
    this.masterNode = HDKey.fromMasterSeed(seed);
  }

  /**
   * // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account
   * @param accountIndex
   */
  public derivePrivateKey(accountIndex: number): Buffer {
    const hdNode = this.masterNode.derive(HDWallet.getHDPath(accountIndex));
    return hdNode._privateKey;
  }

  public deriveAccount(accountIndex: number): SyncAccount {
    return SyncAccount.fromPrivateKey(
      toHex(this.derivePrivateKey(accountIndex))
    );
  }
}
