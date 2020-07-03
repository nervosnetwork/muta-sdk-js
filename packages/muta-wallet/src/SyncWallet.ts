import { Account } from '@mutadev/account';

interface SyncWallet {
  deriveAccount(accountIndex: number): Account;
  derivePrivateKey(accountIndex: number): Buffer;
}

export { SyncWallet };
