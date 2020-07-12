import { parse, stringify } from 'json-bigint';

/**
 * capitalize first letter
 * @example
 * capitalize('fooBar') // => FooBar
 * @param x
 */
export function capitalize(x: string): string {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

/**
 *
 * A safe alternative to `JSON.parse`
 */
export const safeParseJSON = parse;

/**
 * A safe alternative to `JSON.stringify`
 */
export const safeStringifyJSON = stringify;
