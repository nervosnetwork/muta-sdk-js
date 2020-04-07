import { Client } from '@muta/client';
import test from 'ava';
import { createBindingClass, read, Read, write, Write } from './binding';

const client = new Client();

interface MockServiceModel {
  write_something: Write<null, null>;
  read_something: Read<null, null>;
}

const MockService = createBindingClass<MockServiceModel>('mock', {
  read_something: read(),
  write_something: write(),
});

test('error when readonly service try to write', t => {
  const mockService = new MockService(client, null);
  t.throws(() => mockService.write_something(null));
});
