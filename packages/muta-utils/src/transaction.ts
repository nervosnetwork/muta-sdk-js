import { encode, decode } from 'rlp';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';
import {
  InputSignedTransaction,
  Transaction,
  TransactionSignature,
  SignedTransaction,
} from '@mutajs/types';
import { toHex, toBuffer } from './bytes';
import { keccak } from './hash';

/**
 * create a transaction signature
 * @param tx
 * @param privateKey
 */
export function createTransactionSignature(
  tx: Transaction,
  privateKey: Buffer,
): TransactionSignature {
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

  let pubkeys = decode(toBuffer(stx.pubkey));
  if (Array.isArray(pubkeys)) {
      pubkeys.push(publicKeyCreate(uint8PrivateKey));
  } else {
      throw 'MultiSigs pubkey should be rlp encoded list'
  }

  let multiSigs = decode(toBuffer(stx.signature));
  if (Array.isArray(multiSigs)) {
      multiSigs.push(signature);
  } else {
      throw 'MultiSigs signature should be rlp encoded list'
  }

  return {
    ...stx,
    pubkey: toHex(encode(pubkeys)),
    signature: toHex(encode(multiSigs))
  }
}

/**
 * sign a transaction with a private key
 * @param tx
 * @param privateKey
 */
export function signTransaction(
  tx: Transaction,
  privateKey: Buffer,
): InputSignedTransaction {
  const inputEncryption = createTransactionSignature(tx, privateKey);

  return { inputEncryption, inputRaw: tx };
}
