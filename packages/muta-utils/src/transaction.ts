import { encode } from 'rlp';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';
import {
  InputSignedTransaction,
  Transaction,
  TransactionSignature,
} from '@mutajs/types';
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
  const uint8PrivateKey = Uint8Array.from(privateKey);
  const encoded = encode(orderedTx);
  const txHash = keccak(encoded);

  const { signature } = ecdsaSign(txHash, uint8PrivateKey);

  return {
    pubkey: toHex(publicKeyCreate(uint8PrivateKey)),
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
