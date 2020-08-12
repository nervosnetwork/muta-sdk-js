import {
  Address,
  bool,
  createServiceClass,
  Hash,
  read,
  String,
  u32,
  Vec,
  write,
} from '../';
import { Bytes, u64 } from '../types';

const Account = {
  address: Address,
  weight: u32,
  is_multiple: bool,
};

const AddressWithWeight = {
  address: Address,
  weight: u32,
};

const GenerateMultiSigAccountPayload = {
  autonomy: bool,
  owner: Address,
  addr_with_weight: Vec(AddressWithWeight),
  threshold: u32,
  memo: String,
};

const GenerateMultiSigAccountResponse = {
  address: Address,
};

const GetMultiSigAccountPayload = {
  multi_sig_address: Address,
};

const MultiSigPermission = {
  owner: Address,
  accounts: Vec(Account),
  threshold: u32,
  memo: String,
};

const GetMultiSigAccountResponse = {
  permission: MultiSigPermission,
};

const ChangeOwnerPayload = {
  multi_sig_address: Address,
  new_owner: Address,
};

const ChangeMemoPayload = {
  multi_sig_address: Address,
  new_memo: String,
};

const AddAccountPayload = {
  multi_sig_address: Address,
  new_account: Account,
};

const RemoveAccountPayload = {
  multi_sig_address: Address,
  account_address: Address,
};

const SetAccountWeightPayload = {
  multi_sig_address: Address,
  account_address: Address,
  new_weight: u32,
};

const SetThresholdPayload = {
  multi_sig_address: Address,
  new_threshold: u32,
};

const UpdateAccountPayload = {
  account_address: Address,
  owner: Address,
  addr_with_weight: Vec(AddressWithWeight),
  threshold: u32,
  memo: String,
};

const TransactionRequest = {
  method: String,
  service_name: String,
  payload: String,
};

const RawTransaction = {
  chain_id: Hash,
  cycles_price: u64,
  cycles_limit: u64,
  nonce: Hash,
  request: TransactionRequest,
  timeout: u64,
  sender: Address,
};

const SignedTransaction = {
  raw: RawTransaction,
  tx_hash: Hash,
  pubkey: Bytes,
  signature: Bytes,
};

export const MultiSignatureService = createServiceClass('multi_signature', {
  get_account_from_address: read(
    GetMultiSigAccountPayload,
    GetMultiSigAccountResponse,
  ),
  verify_signature: read(SignedTransaction, null),

  generate_account: write(
    GenerateMultiSigAccountPayload,
    GenerateMultiSigAccountResponse,
  ),
  update_account: write(UpdateAccountPayload, null),
  change_owner: write(ChangeOwnerPayload, null),
  change_memo: write(ChangeMemoPayload, null),
  add_account: write(AddAccountPayload, null),
  remove_account: write(RemoveAccountPayload, Account),
  set_account_weight: write(SetAccountWeightPayload, null),
  set_threshold: write(SetThresholdPayload, null),
});
