import { Address } from '@mutadev/types';
import { createServiceBindingClass, read, write } from '../create';

interface AddVerifiedItemPayload {
  service_name: string;
  method_name: string;
}

interface RemoveVerifiedItemPayload {
  service_name: string;
  method_name: string;
}

interface SetAdminPayload {
  new_admin: Address;
}

export const AuthorizationService = createServiceBindingClass({
  serviceName: 'authorization',
  read: {
    check_authorization: read<string, null>(),
  },
  write: {
    add_verified_item: write<AddVerifiedItemPayload, null>(),
    remove_verified_item: write<RemoveVerifiedItemPayload, null>(),
    set_admin: write<SetAdminPayload, null>(),
  },
});
