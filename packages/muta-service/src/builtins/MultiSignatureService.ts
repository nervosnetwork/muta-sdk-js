import { Address, SignedTransaction, Vec, u32 } from '@mutadev/types';
import { createServiceBindingClass, read, write } from '../create';

interface GenerateMultiSigAccountPayload {
  owner: Address;
  addr_with_weight: Vec<AddressWithWeight>;
  threshold: u32;
  memo: string;
}

interface GenerateMultiSigAccountResponse {
  address: Address;
}

interface GetMultiSigAccountPayload {
  multi_sig_address: Address;
}

interface GetMultiSigAccountResponse {
  permission: MultiSigPermission;
}

interface ChangeOwnerPayload {
  multi_sig_address: Address;
  new_owner: Address;
}

interface ChangeMemoPayload {
  multi_sig_address: Address;
  new_memo: string;
}

interface AddAccountPayload {
  multi_sig_address: Address;
  new_account: Account;
}

interface RemoveAccountPayload {
  multi_sig_address: Address;
  account_address: Address;
}

interface SetAccountWeightPayload {
  multi_sig_address: Address;
  account_address: Address;
  new_weight: number;
}

interface SetThresholdPayload {
  multi_sig_address: Address;
  new_threshold: u32;
}

interface UpdateAccountPayload {
  account_address: Address;
  new_account_info: GenerateMultiSigAccountPayload;
}

interface MultiSigPermission {
  owner: Address;
  accounts: Vec<Account>;
  threshold: u32;
  memo: string;
}

interface Account {
  address: Address;
  weight: number;
  is_multiple: boolean;
}

interface AddressWithWeight {
  address: Address;
  weight: number;
}

export const MultiSignatureService = createServiceBindingClass({
  serviceName: 'multi_signature',
  read: {
    get_account_from_address: read<
      GetMultiSigAccountPayload,
      GetMultiSigAccountResponse
    >(),
    verify_signature: read<SignedTransaction, null>(),
  },
  write: {
    generate_account: write<
      GenerateMultiSigAccountPayload,
      GenerateMultiSigAccountResponse
    >(),
    update_account: write<UpdateAccountPayload, null>(),
    change_owner: write<ChangeOwnerPayload, null>(),
    change_memo: write<ChangeMemoPayload, null>(),
    add_account: write<AddAccountPayload, null>(),
    remove_account: write<RemoveAccountPayload, Account>(),
    set_account_weight: write<SetAccountWeightPayload, null>(),
    set_threshold: write<SetThresholdPayload, null>(),
  },
});
