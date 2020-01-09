import createKeccakHash from 'keccak';
import { encode } from 'rlp';
import { publicKeyCreate, sign } from 'secp256k1';
import { toHex } from '../utils';

export function hash(buffer: Buffer): Buffer {
  return createKeccakHash('keccak256')
    .update(buffer)
    .digest();
}

/**
 * create a public key from private key
 */
export { publicKeyCreate };

/**
 * get an account address from a public key
 * @param publicKey
 */
export function addressFromPublicKey(publicKey: Buffer): Buffer {
  const hashed = hash(publicKey);
  return hashed.slice(0, 20);
}

/**
 * create a signature from a transaction
 * @param tx
 * @param privateKey
 */
export function createInputEncryption<P>(
  tx: TransactionRaw<P>,
  privateKey: Buffer
): InputEncryption {
  const orderedRaw = [
    tx.chainId,
    tx.cyclesLimit,
    tx.cyclesPrice,
    tx.nonce,
    tx.method,
    tx.serviceName,
    tx.payload,
    tx.timeout
  ];
  const encoded = encode(orderedRaw);
  const txHash = hash(encoded);

  const { signature } = sign(txHash, privateKey);

  return {
    pubkey: toHex(publicKeyCreate(privateKey)),
    signature: toHex(signature),
    txHash: toHex(txHash)
  };
}

/**
 * sign a transaction
 * @param tx
 * @param privateKey
 */
export function signTransaction<P>(
  tx: TransactionRaw<P>,
  privateKey: Buffer
): SignedTransaction<P> {
  const inputRaw = tx;
  const inputEncryption = createInputEncryption(tx, privateKey);

  return {
    inputEncryption,
    inputRaw
  };
}
