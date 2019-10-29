import { SyncAccount } from '../account';

interface SyncWallet {
  accountByIndex(index: number): SyncAccount;
}

export { SyncWallet };
