import {
  InputSignedTransaction,
  SignedTransaction,
  Transaction,
  TransactionSignature,
} from '@mutadev/types';
import { decode, encode } from 'rlp';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';
import { toBuffer, toHex } from './bytes';
import { keccak } from './hash';

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

  const orderedTx = [
    tx.chainId,
    tx.cyclesLimit,
    tx.cyclesPrice,
    tx.nonce,
    tx.method,
    tx.serviceName,
    tx.payload,
    tx.timeout,
    [Uint8Array.from(toBuffer(tx.sender))],
  ];

  const uint8PrivateKey = Uint8Array.from(privateKey);
  const encoded = encode(orderedTx);
  const txHash = keccak(encoded);

  const { signature } = ecdsaSign(txHash, uint8PrivateKey);

  return {
    pubkey: toHex(encode([publicKeyCreate(uint8PrivateKey)])),
    signature: toHex(encode([signature])),
    txHash: toHex(txHash),
  };
}

export function appendTransactionSignature(
  stx: SignedTransaction,
  privateKey: Buffer,
): SignedTransaction {
  const uint8PrivateKey = Uint8Array.from(privateKey);
  const uint8TxHash = Uint8Array.from(toBuffer(stx.txHash));

  const { signature } = ecdsaSign(uint8TxHash, uint8PrivateKey);

  const pubkeys = decode(toBuffer(stx.pubkey));
  if (Array.isArray(pubkeys)) {
    pubkeys.push(publicKeyCreate(uint8PrivateKey));
  } else {
    throw 'MultiSigs pubkey should be rlp encoded list';
  }

  const multiSigs = decode(toBuffer(stx.signature));
  if (Array.isArray(multiSigs)) {
    multiSigs.push(signature);
  } else {
    throw 'MultiSigs signature should be rlp encoded list';
  }

  return {
    ...stx,
    pubkey: toHex(encode(pubkeys)),
    signature: toHex(encode(multiSigs)),
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
): InputSignedTransaction {
  if (isSignedTransaction(tx)) {
    const signed = appendTransactionSignature(tx, privateKey);
    return {
      inputEncryption: separateOutEncryption(signed),
      inputRaw: separateOutRawTransaction(signed),
    };
  }

  const inputEncryption = createTransactionSignature(tx, privateKey);
  return { inputEncryption, inputRaw: tx };
}
