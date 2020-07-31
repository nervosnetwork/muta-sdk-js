import { parse, stringify } from 'json-bigint';

/**
 *
 * A safe alternative to `JSON.parse`
 */
export const safeParseJSON = parse;

/**
 * A safe alternative to `JSON.stringify`
 */
export const safeStringifyJSON = stringify;
