import {
  parse as safeParseJSON,
  stringify as safeStringifyJSON,
} from 'json-bigint';

/**
 * capitalize first letter
 * @example
 * capitalize('fooBar') // => FooBar
 * @param x
 */
export function capitalize(x: string) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

export { safeParseJSON, safeStringifyJSON };
