import { BigNumber } from '@mutadev/shared';
import { encodeAddress, isValidHexString } from '@mutadev/utils';
import { difference } from 'lodash';
import {
  Address,
  Bytes,
  Hash,
  isNested,
  isVecType,
  ServiceType,
  String,
  u32,
  u64,
} from './types';

export const MAX_U64 = new BigNumber('18446744073709551615');

export function validate(
  schema: ServiceType,
  value: unknown,
): string | undefined {
  if (!schema && value == null) return undefined;

  if (schema === String) {
    if (typeof value !== 'string') return `${value} should be a string`;
  } else if (schema === Address) {
    try {
      encodeAddress(value as string);
    } catch {
      return `${value} is a invalid address`;
    }
  } else if (schema === u32) {
    if (typeof value !== 'number') return `${value} should be a number`;
    if (value < 0 || value > 4294967295) {
      return `${value} should be in range [0, 4294967295]`;
    }
  } else if (schema === u64) {
    if (typeof value !== 'number' && !BigNumber.isBigNumber(value)) {
      return `${value} should be a number or BigNumber`;
    }
    const big = new BigNumber(value);

    if (big.lt(0) || big.gt(MAX_U64)) {
      return `${value} should be in range [0, 18446744073709551615]`;
    }
  } else if (schema === Bytes) {
    if (!isValidHexString(value)) {
      return `${value} is not a valid hex`;
    }
  } else if (schema === Hash) {
    if (!(isValidHexString(value) || (value as string).length === 66)) {
      return `${value} should be a 32 bytes hash formatted as 66 length hex string starts with 0x`;
    }
  } else if (isVecType(schema)) {
    if (!Array.isArray(value)) {
      return `${value} should be an array`;
    }

    return value.reduce<undefined | string>((error, item) => {
      if (error) return `invalid value in Vec: ${error}`;
      return validate(schema.type as ServiceType, item);
    }, undefined);
  } else if (isNested(schema)) {
    const types = Object.entries(schema as Record<string, ServiceType>);
    const values = Object.entries(value as Record<string, unknown>);

    if (types.length !== values.length) {
      const missingKeys = difference(Object.keys(schema), Object.keys(values));
      const excessKeys = difference(Object.keys(schema), Object.keys(values));

      let message = '';
      if (missingKeys.length) message += `missing keys [${missingKeys}]`;
      if (excessKeys.length) message += `excess keys [${excessKeys}]`;
      return message;
    }

    return types.reduce<undefined | string>((error, [key, type]) => {
      const message = validate(type, (value as Record<string, unknown>)[key]);
      if (message) {
        error = (error ?? '') + `${key} is invalid: ${message}`;
      }
      return error;
    }, undefined);
  }

  return undefined;
}
