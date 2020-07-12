/// <reference types="node">

declare module 'keccak' {
  import { createHash } from 'crypto';

  export default createHash;
}

declare module 'json-bigint' {
  export function parse(str: string): Record<string, unknown>;

  export function stringify(obj: Record<string, unknown>): string;
}
