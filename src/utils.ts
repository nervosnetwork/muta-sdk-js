import createKeccakHash from 'keccak';
import randomBytes from 'random-bytes';
import { encode } from 'rlp';
import { publicKeyCreate, sign } from 'secp256k1';
import {
  InputSignedTransaction,
  Transaction,
  TransactionSignature,
} from './type';

/**
 * TRY to remove 0x from a hex string
 * if no 0x starts, do nothing
 * @param hex string
 */
export function rm0x(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * parse to hex string
 * @param x , may be Buffer, number or string(add 0x if needed or do nothing if already find 0x)
 */
export function toHex(x: Buffer | number | string): string {
  if (typeof x === 'string') {
    if (x.startsWith('0x')) {
      return x;
    }
    return '0x' + x;
  }
  if (typeof x === 'number') {
    const hex = Number(x).toString(16);
    return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
  }
  return '0x' + x.toString('hex');
}

/**
 * parse a hex string to buffer, if x is already a Buffer, do nothing
 * @param x , string or Buffer,
 */
export function toBuffer(x: string | Buffer): Buffer {
  if (Buffer.isBuffer(x)) {
    return x;
  }
  return Buffer.from(rm0x(x), 'hex');
}

/**
 * it will first try to call [[toBuffer]] to contains string | Buffer to Buffer
 * then use keccak256 to hash input
 * @param x
 */
export function hash(x: string | Buffer): string {
  return toHex(hashBuf(toBuffer(x)));
}

/**
 * convert a hex string to number
 * @param x
 */
export function hexToNum(x: string): number {
  return Number(toHex(x));
}

/**
 * generate a random [[Address]]
 */
export function randomAddress() {
  return randomHex(20);
}

/**
 * generate given length random hex string
 * @param n
 */
export function randomHex(n: number) {
  return toHex(randomBytes.sync(n).toString('hex'));
}

/**
 * us keccak256 to has the input
 * @param buffer
 */
export function hashBuf(buffer: Buffer): Buffer {
  return createKeccakHash('keccak256')
    .update(buffer)
    .digest();
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
  const txHash = hashBuf(encoded);

  const { signature } = sign(txHash, privateKey);

  const inputEncryption: TransactionSignature = {
    pubkey: toHex(publicKeyCreate(privateKey)),
    signature: toHex(signature),
    txHash: toHex(txHash),
  };

  return {
    inputEncryption,
    inputRaw: tx,
  };
}

/**
 * re-export secp256k1's publicKeyCreate
 */
export { publicKeyCreate };
