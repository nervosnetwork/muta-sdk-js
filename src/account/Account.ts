import { encode } from 'rlp';
import { sign } from 'secp256k1';
import { SignedTransaction, Transaction, TransactionSignature } from '../type';
import { hashBuf, publicKeyCreate, toBuffer, toHex } from '../utils';

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
export class Account {
  private get _publicKey(): Buffer {
    return publicKeyCreate(this._privateKey);
  }

  private get _address(): Buffer {
    return Account.addressFromPublicKey(this._publicKey);
  }

  get publicKey(): string {
    return toHex(this._publicKey);
  }

  get address(): string {
    return toHex(this._address);
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

  /**
   * sign a Muta transaction with this Account's internal private key
   * use case:
   * ```typescript
   *
   *   const account = Account.fromPrivateKey(
   *       '0x1000000000000000000000000000000000000000000000000000000000000000'
   *   );
   *   const signedTransaction = account.signTransaction({
   *     chainId:
   *       '0x0000000000000000000000000000000000000000000000000000000000000000',
   *     cyclesLimit: '0x00',
   *     cyclesPrice: '0x00',
   *     method: 'method',
   *     nonce: '0x0000000000000000000000000000000000000000000000000000000000000000',
   *     payload: 'payload',
   *     serviceName: 'service_name',
   *     timeout: '0x9999'
   *   });
   *
   *   const { pubkey, signature, txHash } = signedTransaction;
   * ```
   *  the output is
   * { chainId:
   * '0x0000000000000000000000000000000000000000000000000000000000000000',
   *  cyclesLimit: '0x00',
   *  cyclesPrice: '0x00',
   *  method: 'method',
   *  nonce:
   *   '0x0000000000000000000000000000000000000000000000000000000000000000',
   *  payload: 'payload',
   *  pubkey:
   *   '0x0308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
   *  serviceName: 'service_name',
   *  signature:
   *   '0xb911f4c58d9ae2c8ea4a546c426f4167813dd0d7a8b5de7f2a7d40e07d7df4572b5670744954ea1f2ff831d5c579fa5d937beb0ddd544d18f8bc069547ac5295',
   *  timeout: '0x9999',
   *  txHash:
   *   '0x26e4ec1c25cc0c6fc084f358b97a7615fee1b229d271ba40bcfc5be80b6dd0d4' }
   * @param tx, [[Transaction]]
   * @return [[SignedTransaction]]
   */
  public signTransaction(tx: Transaction): SignedTransaction {
    const orderedTx = [
      tx.chainId,
      tx.cyclesLimit,
      tx.cyclesPrice,
      tx.nonce,
      tx.method,
      tx.serviceName,
      tx.payload,
      tx.timeout,
    ];
    const encoded = encode(orderedTx);
    const txHash = keccak(encoded);

    const { signature } = sign(txHash, this._privateKey);

    const txSig: TransactionSignature = {
      pubkey: toHex(publicKeyCreate(this._privateKey)),
      signature: toHex(signature),
      txHash: toHex(txHash),
    };

    return {
      chainId: tx.chainId,
      cyclesLimit: tx.cyclesLimit,
      cyclesPrice: tx.cyclesPrice,
      method: tx.method,
      nonce: tx.nonce,
      payload: tx.payload,
      pubkey: txSig.pubkey,
      serviceName: tx.serviceName,
      signature: txSig.signature,
      timeout: tx.timeout,
      txHash: txSig.txHash,
    };
  }
}
