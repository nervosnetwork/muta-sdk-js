/// <reference types="node">

declare module 'keccak' {
  import { createHash } from 'crypto';

  export default createHash;
}

declare module 'json-bigint' {
  export function parse(str: string): any;

  export function stringify(obj: any): string;
}
