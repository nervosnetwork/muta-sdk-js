import { SyncAccount } from '../account';

interface SyncWallet {
  deriveAccount(accountIndex: number): SyncAccount;
  derivePrivateKey(accountIndex: number): Buffer;
}

export { SyncWallet };
