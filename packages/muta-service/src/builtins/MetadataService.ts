import {
  Address,
  createServiceClass,
  Hash,
  read,
  String,
  u32,
  u64,
  Vec,
} from '../';

const ValidatorExtend = {
  bls__key: String,
  pub_key: String,
  address: Address,
  propose_weight: u32,
  vote_weight: u32,
};

const Metadata = {
  chain_id: Hash,
  bech32_address_hrp: String,
  common_ref: String,
  timeout_gap: u64,
  cycles_limit: u64,
  cycles_price: u64,
  interval: u64,
  verifier_list: Vec(ValidatorExtend),
  propose_ratio: u64,
  prevote_ratio: u64,
  precommit_ratio: u64,
  brake_ratio: u64,
  tx_num_limit: u64,
  max_tx_size: u64,
};

export const MetadataService = createServiceClass('metadata', {
  get_metadata: read(null, Metadata),
});
