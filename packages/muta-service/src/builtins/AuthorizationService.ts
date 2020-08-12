import { read, write } from '..';
import { createServiceClass } from '../binding';
import { Address, String } from '../types';

const AddVerifiedItemPayload = {
  service_name: String,
  method_name: String,
};

const RemoveVerifiedItemPayload = {
  service_name: String,
  method_name: String,
};

const SetAdminPayload = {
  new_admin: Address,
};

export const AuthorizationService = createServiceClass('authorization', {
  check_authorization: read(String, null),

  add_verified_item: write(AddVerifiedItemPayload, null),
  remove_verified_item: write(RemoveVerifiedItemPayload, null),
  set_admin: write(SetAdminPayload, null),
});
