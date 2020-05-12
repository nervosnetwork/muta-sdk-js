import { Hasher } from '@mutajs/types';
import createKeccakHash from 'keccak';
import { toBuffer } from './bytes';

export class Keccak256Hasher implements Hasher {
  hash(message: Buffer) {
    return toBuffer(createKeccakHash('keccak256')
      .update(message)
      .digest());
  }
}

export const keccakHash = new Keccak256Hasher().hash;
