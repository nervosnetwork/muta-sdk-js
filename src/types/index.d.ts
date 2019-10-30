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

/**
 * There are many types of transaction in Muta, the RawTransaction is the base of
 * a transaction. A transaction often consists of three parts, InputRaw, InputAction,
 * and InputEncryption.
 */
interface RawTransaction {
  chainId: Hash;

  feeCycle: Uint64;
  feeAssetId: Hash;
  nonce: Hash;
  timeout: Uint64;
}

interface TransferTransactionAction {
  carryingAmount: Uint64;
  carryingAssetId: Hash;
  receiver: Address;
}

type TransferTransaction = import('utility-types').Assign<
  RawTransaction,
  TransferTransactionAction
>;

type SignedTransferTransaction = import('utility-types').Assign<
  TransferTransaction,
  InputEncryption
>;
