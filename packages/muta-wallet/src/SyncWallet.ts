import { DefaultAccount } from '@mutajs/account';

interface SyncWallet {
  deriveAccount(accountIndex: number): DefaultAccount;
  derivePrivateKey(accountIndex: number): Buffer;
}

export { SyncWallet };
