import { Account } from '../account';

interface SyncWallet {
  deriveAccount(accountIndex: number): Account;
  derivePrivateKey(accountIndex: number): Buffer;
}

export { SyncWallet };
