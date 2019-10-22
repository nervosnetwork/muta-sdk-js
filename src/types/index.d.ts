type Hash = string;
type Bytes = string;

type Uint64 = string;

// Account address is a 21 bytes, and starts with 0x
type Address = string;

interface InputEncryption {
  txHash: Hash;
  pubkey: Bytes;
  signature: Bytes;
}

interface TransferTx {
  chainId: Hash;

  feeCycle: Uint64;
  feeAssetId: Hash;
  nonce: Hash;
  timeout: Uint64;

  carryingAmount: Uint64;
  carryingAssetId: Hash;
  receiver: Address;
}
