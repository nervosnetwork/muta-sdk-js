import { encode } from 'rlp';
import { sign } from 'secp256k1';
import { SignedTransaction, Transaction, TransactionSignature } from '../type';
import { hashBuf, publicKeyCreate, toBuffer, toHex } from '../utils';

/**
 * SyncAccount provides the API in sync way, convenient but not so safe.
 * use case:
 * ```typescript
 * var account = SyncAccount.fromPrivateKey("0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f");
 * var signature = account.signTransaction({
 *    "carryingAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
 *    "chainId": "0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036",
 *     "feeAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
 *    "feeCycle": "0xff",
 *     "receiver": "0x103e9b982b443592ffc3d4c2a484c220fb3e29e2e4",
 *     "nonce": "0x00000000000000000000000000000000bcc53bb0e6b57f561ebf1f0bc65fa8b1",
 *     "timeout": "0x22752",
 *     "carryingAmount": "0x01"
 *   });
 * // output:
 * // {
 * //       "txHash": "0x2cb89cbdd613f7af728a095e3949d38de45e4fd56ce5618a076bd40becd5f9de",
 * //       "pubkey": "0x031288a6788678c25952eba8693b2f278f66e2187004b64ac09416d07f83f96d5b",
 * //       "signature": "0xd1dc56336facdcbff3caeec4f5c179f50709aa16f1f981d00b0cad543c14e9e631392b974c52b1f4478730f3f0c501b81d302eb2665d8d8b11297466d2aa8bac"
 * // }
 * ```
 */
export class SyncAccount {
  private get _publicKey(): Buffer {
    return publicKeyCreate(this._privateKey);
  }

  private get _address(): Buffer {
    return SyncAccount.addressFromPublicKey(this._publicKey);
  }

  get publicKey(): string {
    return toHex(this._publicKey);
  }

  get address(): string {
    return toHex(this._address);
  }

  public static fromPrivateKey(privateKey: string): SyncAccount {
    return new SyncAccount(toBuffer(privateKey));
  }

  /**
   * get an account address from a public key
   * @param publicKey
   */
  public static addressFromPublicKey(publicKey: Buffer): Buffer {
    const hashed = hashBuf(publicKey);
    return hashed.slice(0, 20);
  }

  // tslint:disable-next-line:variable-name
  private readonly _privateKey: Buffer;

  constructor(privateKey: Buffer) {
    this._privateKey = privateKey;
  }

  public signTransaction(tx: Transaction): SignedTransaction {
    const orderedTx = [
      tx.chainId,
      tx.cyclesLimit,
      tx.cyclesPrice,
      tx.nonce,
      tx.method,
      tx.serviceName,
      tx.payload,
      tx.timeout
    ];
    const encoded = encode(orderedTx);
    const txHash = hashBuf(encoded);

    const { signature } = sign(txHash, this._privateKey);

    const txSig: TransactionSignature = {
      pubkey: toHex(publicKeyCreate(this._privateKey)),
      signature: toHex(signature),
      txHash: toHex(txHash)
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
      txHash: txSig.txHash
    };
  }
}
