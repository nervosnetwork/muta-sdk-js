import { Keccak256Hasher, toBuffer, toHex } from '@mutajs/utils';
import { BaseAccount, SignatureType } from './BaseAccount';

/**
 * Account is concept of A use on Muta chain.
 * it like other block chain, address is only identifier for different users, so as Muta
 * Account contains a privateKey, and could extract its publicKey and address
 * what's more, Account takes job of [[signTransaction]]
 *
 * Here is an example:
 * ```js
 * async function example(){
 *   const account = Account.fromPrivateKey(
 *     '0x1000000000000000000000000000000000000000000000000000000000000000'
 * );
 *
 * const signedTransaction = account.signTransaction({
 *  chainId:
 *    '0x0000000000000000000000000000000000000000000000000000000000000000',
 *  cyclesLimit: '0x00',
 *  cyclesPrice: '0x00',
 *  method: 'method',
 *  nonce: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *  payload: 'payload',
 *  serviceName: 'service_name',
 *  timeout: '0x9999'
 * });
 * }
 * ```
 */
export class DefaultAccount extends BaseAccount {
  signatureType = SignatureType.ACCOUNT_TYPE_PUBLIC_KEY;

  constructor(privateKey: Buffer) {
    super([privateKey]);
  }

  get publicKey(): string {
    return toHex(this._publicKey);
  }

  get address(): string {
    return toHex(this._address);
  }

  private get _publicKey(): Buffer {
    return this.signers[0].publicKey();
  }

  private get _address(): Buffer {
    return DefaultAccount.addressFromPublicKey(this._publicKey);
  }

  /**
   *
   * @param privateKey, hex string starts with 0x, the private is 32 bytes
   * @return [[Account]]
   */
  public static fromPrivateKey(privateKey: string): DefaultAccount {
    return new DefaultAccount(toBuffer(privateKey));
  }

  /**
   * get the account address from a public key
   * @param publicKey, string | Buffer,
   * @return Buffer,
   */
  public static addressFromPublicKey(publicKey: Buffer | string): Buffer {
    const hashed = new Keccak256Hasher().hash(toBuffer(publicKey));
    return hashed.slice(0, 20);
  }
}
