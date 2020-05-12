import { Serde } from '@mutajs/types';
import { decode as RLPDecode, encode as RLPEncode, Input } from 'rlp';
import { safeParseJSON, safeStringifyJSON } from './common';

export class RlpSerde implements Serde<Input, Buffer> {
  serialize = RLPEncode;

  deserialize = RLPDecode;
}

export class SafeJsonStringSerde<T = any> implements Serde<T, string> {
  serialize = safeStringifyJSON;

  deserialize = safeParseJSON;
}
