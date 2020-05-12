import { Address, SignedTransaction, Transaction } from '@mutajs/types';

export interface IAccount {
  address: Address;

  signTransaction<P>(raw: Transaction<P>): SignedTransaction;
}
