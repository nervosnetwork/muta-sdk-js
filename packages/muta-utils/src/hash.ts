import createKeccakHash from 'keccak';

/**
 * us keccak256 to has the input
 * @param buffer
 */
export function keccak(buffer: Buffer): Buffer {
  return createKeccakHash('keccak256').update(buffer).digest();
}
