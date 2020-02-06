type Hex = string;
type Hash = Hex;
type Bytes = Hex;
type Uint64 = Hex;
// Account address is a 21 bytes, and starts with 0x
type Address = Hex;

/**
 * The signature
 */
interface InputEncryption {
  txHash: Hash;
  pubkey: Bytes;
  signature: Bytes;
}

interface TransactionRaw<R> {
  chainId: Hash;
  cyclesLimit: Uint64;
  cyclesPrice: Uint64;
  nonce: Hash;
  timeout: Uint64;
  serviceName: string;
  method: string;
  payload: R;
}

interface SignedTransaction<R> {
  inputRaw: TransactionRaw<R>;
  inputEncryption: InputEncryption;
}

interface ServicePayload<P> {
  height?: Uint64;
  cyclesLimit?: Uint64;
  cyclesPrice?: Uint64;
  caller?: Address;
  serviceName: string;
  method: string;
  payload: P;
}
