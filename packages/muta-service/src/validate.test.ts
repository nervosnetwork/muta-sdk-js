import { BigNumber } from '@mutadev/shared';
import {
  Address,
  HashMap,
  Option,
  ServiceType,
  String,
  u64,
  Vec,
} from './types';
import { validate } from './validate';

function containsErrorMessage(schema: ServiceType, value: unknown): string {
  const message = validate(schema, value);
  expect(message).not.toBeUndefined();
  return message as string;
}

function withoutErrorMessage(schema: ServiceType, value: unknown) {
  expect(validate(schema, value)).toBeUndefined();
}

test('validate basic primitive', () => {
  containsErrorMessage(Address, '');
});

test('validate with vec', () => {
  withoutErrorMessage(Vec(String), []);
  withoutErrorMessage(Vec(String), ['']);
  withoutErrorMessage(Vec(String), ['hello', '']);

  containsErrorMessage(Vec(String), [1]);
  containsErrorMessage(Vec(String), [{}]);
  containsErrorMessage(Vec(String), [undefined, null]);
  containsErrorMessage(Vec(String), ['undefined', null]);
});

test('validate with schema', () => {
  withoutErrorMessage({}, {});
  withoutErrorMessage({ name: String }, { name: '' });

  containsErrorMessage({ name: String }, {});
  containsErrorMessage({ name: String }, { name: '', other: '' });
});

test('validate Option<T>', () => {
  withoutErrorMessage(Option(String), null);
  withoutErrorMessage(Option(String), 'string');

  containsErrorMessage(Option(String), 1);
});

test('validate HashMap<T>', () => {
  withoutErrorMessage(HashMap(String), { key: 'value' });
  withoutErrorMessage(HashMap(String), {});

  containsErrorMessage(HashMap(String), { key: 2 });
  containsErrorMessage(HashMap(String), { key: undefined });
});

test('validate with complex schema', () => {
  const schema1 = {
    name: String,
    value: u64,
    vec: Vec({ name: String, value: u64 }),
    nested: {
      name: String,
      value: u64,
      vec: Vec({ name: String, value: u64 }),
      option: Option(String),
    },
  };
  const value1 = {
    name: 'String',
    value: new BigNumber(0),
    vec: [{ name: 'String', value: 0 }],
    nested: {
      name: 'String',
      value: new BigNumber('18446744073709551615'),
      vec: [{ name: 'String', value: 1 }],
      option: 'string',
    },
  };

  const value2 = {
    name: 'String',
    value: new BigNumber(0),
    vec: [{ name: 'String', value: 0 }],
    nested: {
      name: 'String',
      value: new BigNumber('18446744073709551615'),
      vec: [{ name: 'String', value: 'should be number' }],
      option: 1, // should be string
    },
  };

  expect(validate(schema1, value1)).toBeUndefined();
  expect(validate(schema1, value2)).not.toBeUndefined();
});
