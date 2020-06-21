import { Account } from '@mutajs/account';
import { Client } from '@mutajs/client';
import { createBindingClass, read, Read, write, Write } from './binding';

const account = Account.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);

const client = new Client();

interface MockServiceModel {
  write_something: Write<null, null>;
  read_something: Read<null, null>;
}

const MockService = createBindingClass<MockServiceModel>('mock', {
  read_something: read(),
  write_something: write(),
});

it('error when readonly service try to write', () => {
  const mockService = new MockService(client, account.address);
  expect(() => mockService.write_something(null)).toThrow();
});
