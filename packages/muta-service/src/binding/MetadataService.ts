import { createBindingClass, read, Read } from '../';
import { Address, Hash, u32, u64, Vec } from '@mutajs/types';

interface ValidatorExtend {
  bls__key: string;
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

export interface MetadataServiceModel {
  get_metadata: Read<null, Metadata>;
}

export const MetadataService = createBindingClass<MetadataServiceModel>(
  'metadata',
  {
    get_metadata: read(),
  },
);
