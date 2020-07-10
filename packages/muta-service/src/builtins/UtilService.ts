import { Hash, Hex } from '@mutadev/types';
import { createServiceBindingClass, read } from '../create';

interface KeccakPayload {
  hex_str: Hex;
}

interface KeccakResponse {
  result: Hash;
}

interface SigVerifyPayload {
  hash: Hash;
  sig: Hex;
  pub_key: Hex;
}

interface SigVerifyResponse {
  is_ok: boolean;
}

export const UtilService = createServiceBindingClass({
  serviceName: 'util',
  read: {
    keccak256: read<KeccakPayload, KeccakResponse>(),
    verify: read<SigVerifyPayload, SigVerifyResponse>(),
  },
});
