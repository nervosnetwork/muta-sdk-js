import { Client } from '@mutajs/client';
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

it('error when readonly service try to write', () => {
  const mockService = new MockService(client);
  expect(() => mockService.write_something(null)).toThrow();
});
