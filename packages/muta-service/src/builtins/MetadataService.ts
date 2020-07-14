import { Address, Bytes, Hash, u32, u64, Vec } from '@mutadev/types';
import { createServiceBindingClass, read } from '../create';

interface ValidatorExtend {
  bls__key: string;
  pubkey: Bytes;
  address: Address;
  propose_weight: u32;
  vote_weight: u32;
}

interface Metadata {
  chain_id: Hash;
  common_ref: string;
  timeout_gap: u64;
  cycles_limit: u64;
  cycles_price: u64;
  interval: u64;
  verifier_list: Vec<ValidatorExtend>;
  propose_ratio: u64;
  prevote_ratio: u64;
  precommit_ratio: u64;
  brake_ratio: u64;
}

export const MetadataService = createServiceBindingClass({
  serviceName: 'metadata',
  read: {
    get_metadata: read<null, Metadata>(),
  },
});
