import { encode } from 'rlp';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';
import {
  InputSignedTransaction,
  Transaction,
  TransactionSignature,
} from '@muta/types';
import { toHex } from './bytes';
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
  ];
  const encoded = encode(orderedTx);
  const txHash = keccak(encoded);

  const { signature } = ecdsaSign(txHash, privateKey);

  return {
    pubkey: toHex(publicKeyCreate(privateKey)),
    signature: toHex(signature),
    txHash: toHex(txHash),
  };
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
