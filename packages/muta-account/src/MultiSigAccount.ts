import { Address } from '@mutajs/types';
import { BaseAccount, SignatureType } from './BaseAccount';

export class DefaultMultiSigAccount extends BaseAccount {
  signatureType = SignatureType.ACCOUNT_TYPE_MULTI_SIG;

  constructor(privateKeys: Buffer[], sender: Address) {
    super(privateKeys, sender);
  }
}
