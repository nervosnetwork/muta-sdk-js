import test from 'ava';
import { Muta } from '../Muta';
import { createBindingClass, read, Read, write, Write } from './binding';

const client = Muta.createDefaultMutaInstance().client();

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
