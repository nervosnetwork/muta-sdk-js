export interface Signer {
  publicKey: () => Buffer;
  sign: (message: Buffer) => Buffer;
}

export interface Hasher {
  hash: (message: Buffer) => Buffer;
}

export interface Serde<Decoded = any, Encoded = any> {
  serialize: (message: Decoded) => Encoded;

  deserialize: (buf: Encoded) => Decoded;
}
