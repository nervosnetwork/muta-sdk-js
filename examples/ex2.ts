import { Muta } from '../src';

/**
 * let us start a simple example to understand Wallet class
 *
 * Please, if you don't have any Hierarchical Deterministic Wallet for more information see
 *
 * for more information see
 * [bip32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki),
 * [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * [bip44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 */
(async function WalletExample() {
  /**
   * first, we get the wallet class
   */
  const wallet = Muta.hdWallet;

  /**
   * to use HD wallet, usually you should get a mnemonic phrase
   * for example:
   *
   * gallery glass robot visual tooth canyon struggle dwarf project faint current predict draft size alter
   *
   * this is a random 12 mnemonic words.
   *
   * let us get a random 12 mnemonic words
   */
  const mnemonicWords = wallet.generateMnemonic();

  /**
   * now, you can use the generated 12 words to create a HD wallet
   *
   * in details of HD wallet, the 12 word will be calculated to a seed, which will
   * be used to init the master node of so call HIERARCHICAL nodes
   */

  const hdWallet = new wallet(mnemonicWords);

  /**
   * since you have got the hdWallet, which means you now can derive the path and
   * get the children nodes
   *
   * however due to the bip specific, our wallet only support you to derive considered nodes
   *
   * and below is the Path:
   *
   * `m/44'/${COIN_TYPE}'/${accountIndex}'/0/0`;
   *
   * as Muta chain's COIN_TYPE is set to
   * export const COIN_TYPE = 918;
   *
   *
   * here we are going to derive a path with accountIndex 2 of the wallet you created
   */

  const account = hdWallet.deriveAccount(2);

  /**
   * now you get an account, please go on to next example of Account
   */
})();
