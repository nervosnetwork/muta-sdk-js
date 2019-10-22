import * as RLP from 'rlp';
import { publicKeyCreate, sign } from 'secp256k1';
import { toHex, hash } from '../utils';

/**
 * create a public key from private key
 */
export { publicKeyCreate };

/**
 * calc an account address from a public key
 * @param publicKey
 */
export function addressFromPublicKey(publicKey: Buffer): Buffer {
  const hashed = hash(publicKey);
  const address = hashed.slice(0, 20);
  const magicAddressPrefix = Buffer.from([0x10]);
  return Buffer.concat([Buffer.from(magicAddressPrefix), Buffer.from(address)]);
}

/**
 * create a Transfer Transaction signature
 * @param tx
 * @param privateKey
 */
export function signTransferTx(
  tx: TransferTx,
  privateKey: Buffer
): InputEncryption {
  let orderedTx = [
    tx.chainId,
    tx.feeCycle,
    tx.feeAssetId,
    tx.nonce,
    tx.timeout
  ];
  orderedTx = orderedTx.concat([
    tx.carryingAmount,
    tx.carryingAssetId,
    tx.receiver
  ]);

  const encoded = RLP.encode(orderedTx);
  const txHash = hash(encoded);

  const { signature } = sign(txHash, privateKey);
  return {
    txHash: toHex(txHash),
    pubkey: toHex(publicKeyCreate(privateKey)),
    signature: toHex(signature)
  };
}
