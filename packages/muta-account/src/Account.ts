import { SignedTransaction, Transaction } from '@mutajs/types';
import {
  createTransactionSignature,
  keccak,
  publicKeyCreate,
  toBuffer,
  toHex,
} from '@mutajs/utils';

/**
 * If you are familiar with Ethereum, you will find that Muta's account system is similar to Ethereum.
 * Simply put, Muta's account is also secured by ECDSA cryptography.
 * A private key corresponds to a Muta account.
 * We can use the private key to create an account like this `new Account('0x...')`.
 * Generally used for [[signTransaction]]
 *
 * Here is an example:
 * ```js
 * import { Account } from '@mutajs/account';
 * import { Client } from '@mutajs/client';
 *
 * async function example() {
 *   const client = new Client();
 *   const account = new Account('0x...'); // private key
 *
 *   // create an UDT
 *   const rawTransaction = await client.composeTransaction({
 *     serviceName: 'asset',
 *     method: 'create_asset',
 *     payload: {
 *       name: 'MyToken',
 *       symbol: 'MT',
 *       supply: 100_000_000,
 *     }
 *   });
 *
 *   const signedTransaction = account.signTransaction(rawTransaction);
 *   client.sendTransaction(signedTransaction);
 * }
 * ```
 */
export class Account {
  // tslint:disable-next-line:variable-name
  private readonly _privateKey: Buffer;

  /**
   * create an Account by pass a buffer containing private key
   * this is not recommended, consider using [[fromPrivateKey]]
   * @param privateKey Buffer | Buffer-like
   */
  constructor(privateKey: Buffer) {
    this._privateKey = privateKey;
  }

  get publicKey(): string {
    return toHex(this._publicKey);
  }

  get address(): string {
    return toHex(this._address);
  }

  private get _publicKey(): Buffer {
    return publicKeyCreate(this._privateKey);
  }

  private get _address(): Buffer {
    return Account.addressFromPublicKey(this._publicKey);
  }

  /**
   *
   * @param privateKey, hex string starts with 0x, the private is 32 bytes
   * @return [[Account]]
   */
  public static fromPrivateKey(privateKey: string): Account {
    return new Account(toBuffer(privateKey));
  }

  /**
   * get the account address from a public key
   * @param publicKey, string | Buffer,
   * @return Buffer,
   */
  public static addressFromPublicKey(publicKey: Buffer | string): Buffer {
    const hashed = keccak(toBuffer(publicKey));
    return hashed.slice(0, 20);
  }

  /**
   * sign a Muta transaction with this Account's internal private key
   *
   * @param tx, [[Transaction]]
   * @return [[SignedTransaction]]
   */
  public signTransaction(tx: Transaction): SignedTransaction {
    const { txHash, signature, pubkey } = createTransactionSignature(
      tx,
      this._privateKey,
    );

    return {
      chainId: tx.chainId,
      cyclesLimit: tx.cyclesLimit,
      cyclesPrice: tx.cyclesPrice,
      method: tx.method,
      nonce: tx.nonce,
      payload: tx.payload,
      pubkey,
      serviceName: tx.serviceName,
      signature,
      timeout: tx.timeout,
      txHash,
    };
  }
}
