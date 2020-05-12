import { Signer } from '@mutajs/types';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';

export class Secp256k1Signer implements Signer {
  constructor(private privateKey: Buffer) {}

  publicKey() {
    return Buffer.from(publicKeyCreate(Uint8Array.from(this.privateKey)));
  }

  sign(message: Buffer) {
    const signed = ecdsaSign(
      Uint8Array.from(message),
      Uint8Array.from(this.privateKey),
    );
    return Buffer.from(signed.signature);
  }
}
