import {
  Address,
  Hasher,
  Serde,
  SignedTransaction,
  Signer,
  Transaction,
  Witness,
} from '@mutajs/types';
import {
  Keccak256Hasher,
  RlpSerde,
  SafeJsonStringSerde,
  Secp256k1Signer,
  toHex,
} from '@mutajs/utils';
import { IAccount } from './IAccount';

export enum SignatureType {
  ACCOUNT_TYPE_PUBLIC_KEY = 0,
  ACCOUNT_TYPE_MULTI_SIG = 1,
}

export abstract class BaseAccount implements IAccount {
  abstract signatureType: number;

  protected signers: Signer[];
  protected hasher: Hasher;
  protected cryptoSerde: Serde;
  protected rpcSerde: Serde;

  address: Address;

  protected constructor(privateKeys: Buffer[], address?: Address) {
    this.signers = privateKeys.map(pk => new Secp256k1Signer(pk));
    this.hasher = new Keccak256Hasher();
    this.cryptoSerde = new RlpSerde();
    this.rpcSerde = new SafeJsonStringSerde();

    if (address) {
      this.address = address;
    }
  }

  signTransaction<P>(raw: Transaction<P>): SignedTransaction {
    const serializedPayload = this.rpcSerde.serialize(raw.payload);

    const encoded = this.cryptoSerde.serialize([
      raw.chainId,
      raw.cyclesLimit,
      raw.cyclesPrice,
      raw.nonce,
      raw.method,
      raw.serviceName,
      serializedPayload,
      raw.timeout,
    ]);

    const txHash = this.hasher.hash(encoded);
    const signatures = this.signers.map(signer => toHex(signer.sign(txHash)));
    const pubkeys = this.signers.map(signer => toHex(signer.publicKey()));

    const witness: Witness = {
      pubkeys,
      signatures,
      signatureType: this.signatureType,
    };

    return {
      raw: {
        ...raw,
        payload: serializedPayload,
      },
      witness: this.rpcSerde.serialize({
        ...witness,
        signature_type: this.signatureType,
        sender: this.address,
      }),
      txHash: toHex(txHash),
    };
  }
}
