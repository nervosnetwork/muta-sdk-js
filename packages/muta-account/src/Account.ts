import { DefaultVariables } from '@mutadev/defaults';
import { invariant } from '@mutadev/shared';
import { Address, Bytes, SignedTransaction, Transaction } from '@mutadev/types';
import {
  addressFromPublicKey,
  createTransactionSignature,
  isValidHexString,
  privateKeyToPublicKey,
  separateOutRawTransaction,
  toBuffer,
  toHex,
} from '@mutadev/utils';

/**
 * If you are familiar with Ethereum, you will find that Muta's account system is similar to Ethereum.
 * Simply put, Muta's account is also secured by ECDSA cryptography.
 * A private key corresponds to a Muta account.
 * We can use the private key to create an account like this `new Account('0x...')`.
 * Generally used for [[signTransaction]]
 *
 * Here is an example:
 * ```js
 * import { Account } from '@mutadev/account';
 * import { Client } from '@mutadev/client';
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
  #privateKey: Buffer;

  constructor(
    privateKey: Buffer | Bytes = DefaultVariables.get('MUTA_PRIVATE_KEY'),
  ) {
    if (typeof privateKey === 'string') {
      invariant(
        privateKey.length === 66 && isValidHexString(privateKey),
        'create an account with incorrect private key, ' +
          'only 64-length hex or 32-bytes Buffer is valid',
      );
    }
    privateKey = toBuffer(privateKey);
    invariant(
      privateKey.length === 32,
      'private key should be an 32-bytes Buffer',
    );
    this.#privateKey = privateKey;
  }

  get publicKey(): string {
    return toHex(this._publicKey);
  }

  get address(): string {
    return this._address;
  }

  private get _publicKey(): Buffer {
    return privateKeyToPublicKey(this.#privateKey);
  }

  private get _address(): Address {
    return addressFromPublicKey(this._publicKey);
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
   * sign a Muta transaction with this Account's internal private key
   */
  public signTransaction(
    tx: Transaction | SignedTransaction,
  ): SignedTransaction {
    const { txHash, signature, pubkey } = createTransactionSignature(
      tx,
      this.#privateKey,
    );

    return {
      ...separateOutRawTransaction(tx),
      pubkey,
      signature,
      txHash,
    };
  }
}

/**
 * try to get a default account
 * @internal
 * @throws
 */
export function tryGetDefaultAccount(): Account {
  return new Account();
}
