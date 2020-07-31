import { invariant } from '@mutadev/shared';
import {
  Address,
  Bytes,
  SignedTransaction,
  Transaction,
  TransactionSignature,
} from '@mutadev/types';
import { decode as rlpDecode, encode as rlpEncode } from 'rlp';
import {
  ecdsaRecover,
  ecdsaSign,
  ecdsaVerify,
  publicKeyCreate,
} from 'secp256k1';
import {
  addressFromPublicKey,
  decodeAddress,
  encodeAddress,
  privateKeyToPublicKey,
} from './account';
import { toBuffer, toHex, toUint8Array } from './bytes';
import { keccak } from './hash';

interface DecodedEncryption<T> {
  pubkeys: T[];
  signatures: T[];
}

interface Transformer<T> {
  (buf: Buffer): T;
}

interface EncodedEncryption {
  pubkey: Bytes;
  signature: Bytes;
}

/**
 * decode RPL encoded encryption
 * @example
 *
 * // decode signed transaction encryption
 * const signedTransaction = signTransaction(...);
 * const decoded1 = decodeEncryption(signedTransaction)
 *
 * // or just pass the signature and pubkey manually
 * const decoded2 = decodeEncryption({
 *   signature: '0x...',
 *   pubkey: '0x...',
 * }, toHex)
 *
 * @throws Error
 */
export function decodeEncryption<T = Buffer>(
  encryption: EncodedEncryption,
  transformer?: Transformer<T>,
): DecodedEncryption<T> {
  const signaturesBuf = rlpDecode(toBuffer(encryption.signature));
  const pubkeysBuf = rlpDecode(toBuffer(encryption.pubkey));

  invariant(
    Array.isArray(signaturesBuf),
    `wrong signature format, signature is not an array`,
  );
  invariant(
    Array.isArray(pubkeysBuf),
    `wrong pubkey format, pubkey is not an array`,
  );

  if (!transformer) {
    return {
      signatures: signaturesBuf,
      pubkeys: pubkeysBuf,
    };
  }

  return {
    signatures: signaturesBuf.map(transformer),
    pubkeys: pubkeysBuf.map(transformer),
  };
}

export function encodeTransaction(tx: Transaction): Buffer {
  invariant(tx.sender, `empty sender is found in transaction`);

  const orderedTx = [
    tx.chainId,
    tx.cyclesLimit,
    tx.cyclesPrice,
    tx.nonce,
    tx.method,
    tx.serviceName,
    tx.payload,
    tx.timeout,
    [toBuffer(encodeAddress(tx.sender))],
  ];

  return rlpEncode(orderedTx);
}

export function decodeTransaction(buf: Buffer): Transaction {
  const [
    chainId,
    cyclesLimit,
    cyclesPrice,
    nonce,
    method,
    serviceName,
    payload,
    timeout,
    senders,
  ] = rlpDecode(buf);

  invariant(Array.isArray(senders) && senders.length > 0, 'sender decode fail');

  return {
    chainId: toHex(chainId),
    cyclesLimit: toHex(cyclesLimit),
    cyclesPrice: toHex(cyclesPrice),
    nonce: toHex(nonce),
    method: method.toString(),
    serviceName: serviceName.toString(),
    payload: payload.toString(),
    timeout: toHex(timeout),
    sender: decodeAddress(senders[0]),
  };
}

/**
 *
 * @throws Error
 */
export function toTxHash(tx: Transaction): Buffer {
  const encoded = encodeTransaction(tx);
  return keccak(encoded);
}

/**
 * create a transaction signature
 * @param tx
 * @param privateKey
 */
export function createTransactionSignature(
  tx: Transaction | SignedTransaction,
  privateKey: Buffer,
): TransactionSignature {
  if (isSignedTransaction(tx)) {
    return separateOutEncryption(appendTransactionSignature(tx, privateKey));
  }

  const uint8PrivateKey = Uint8Array.from(privateKey);
  const txHash = toTxHash(tx);

  const { signature } = ecdsaSign(txHash, uint8PrivateKey);

  return {
    pubkey: toHex(rlpEncode([publicKeyCreate(uint8PrivateKey)])),
    signature: toHex(rlpEncode([signature])),
    txHash: toHex(txHash),
  };
}

export function appendTransactionSignature(
  stx: SignedTransaction,
  privateKey: Buffer,
): SignedTransaction {
  const uint8PrivateKey = toUint8Array(privateKey);

  const uint8TxHash = toUint8Array(stx.txHash);
  const { signature } = ecdsaSign(uint8TxHash, uint8PrivateKey);

  const { signatures, pubkeys } = decodeEncryption(stx);
  pubkeys.push(privateKeyToPublicKey(privateKey));
  signatures.push(toBuffer(signature));

  return {
    ...stx,
    pubkey: toHex(rlpEncode(pubkeys)),
    signature: toHex(rlpEncode(signatures)),
  };
}

export function isSignedTransaction(
  tx: Transaction | SignedTransaction,
): tx is SignedTransaction {
  return 'pubkey' in tx && 'signature' in tx && 'txHash' in tx;
}

export function separateOutRawTransaction(
  tx: Transaction | SignedTransaction,
): Transaction {
  return {
    chainId: tx.chainId,
    cyclesLimit: tx.cyclesLimit,
    cyclesPrice: tx.cyclesPrice,
    method: tx.method,
    nonce: tx.nonce,
    payload: tx.payload,
    sender: tx.sender,
    serviceName: tx.serviceName,
    timeout: tx.timeout,
  };
}

export function separateOutEncryption(
  signedTx: SignedTransaction,
): TransactionSignature {
  return {
    pubkey: signedTx.pubkey,
    signature: signedTx.signature,
    txHash: signedTx.txHash,
  };
}

/**
 * sign a transaction with a private key
 * @param tx
 * @param privateKey
 */
export function signTransaction(
  tx: Transaction | SignedTransaction,
  privateKey: Buffer,
): SignedTransaction {
  if (isSignedTransaction(tx)) {
    return appendTransactionSignature(tx, privateKey);
  }

  const inputEncryption = createTransactionSignature(tx, privateKey);
  return { ...tx, ...inputEncryption };
}

const RECIDS = [0, 1, 2, 3];

/**
 * verify a signature is signed by an address,
 * will only verify the signature and the transaction when the address is not provided.
 * This method only provides an **offline** signature verification algorithm,
 * so it does not support scenarios like
 * [MultiSignatureService](https://github.com/nervosnetwork/muta/tree/master/built-in-services/multi-signature)
 * where weighted and weighted verification is handled on the server side.
 */
export function verifyTransaction(
  signature: Buffer,
  tx: Transaction,
  address?: Address | Address[],
): boolean {
  const txHashBytes = toUint8Array(toTxHash(tx));
  const decodedSignature = rlpDecode(toBuffer(signature));

  if (!Array.isArray(decodedSignature)) return false;
  if (decodedSignature.length < 1) return false;

  return (decodedSignature as Buffer[]).every((sigBuf, i) => {
    const signatureBytes = toUint8Array(sigBuf);

    return RECIDS.some((recid) => {
      let publicKey;
      try {
        publicKey = ecdsaRecover(signatureBytes, recid, txHashBytes);
      } catch {
        return false;
      }

      if (address) {
        const actualAddress = addressFromPublicKey(publicKey);

        if (Array.isArray(address)) {
          if (actualAddress !== address[i]) {
            return false;
          }
        } else if (actualAddress !== address) {
          return false;
        }
      }

      return ecdsaVerify(signatureBytes, txHashBytes, publicKey);
    });
  });
}
