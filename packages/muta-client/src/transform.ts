import { safeParseJSON, safeStringifyJSON } from '@mutadev/utils';

export interface Transformer<Source = unknown, Target = unknown> {
  (source?: Source): Target;
}

export interface Serializer {
  serialize: Transformer<unknown, string>;
  deserialize: Transformer<string, unknown>;
}

export const defaultSerializer: Serializer = {
  serialize(x: unknown): string {
    if (typeof x !== 'string') {
      return safeStringifyJSON(x);
    }
    return x;
  },
  deserialize: safeParseJSON,
};
