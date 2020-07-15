import { Address, Bytes, Hash, Hex, Int, Uint64 } from './scalar';

/**
 * The Block struct
 */
export interface Block {
  header: BlockHeader;
  orderedTxHashes: Hash[];
  hash: Hash;
}

/**
 * the block header
 * cause the Overlord consensus detachs the Replica State Machine and the Ordering fo Consensus
 * so the tx ordered and tx committed(runs properly and commit changes to state machine) may differ
 */
export interface BlockHeader {
  /**
   * Identifier of a chain in order to prevent replay attacks across channels
   */
  chainId: Hash;
  /**
   * The merkle roots of all the confirms
   */
  confirmRoot: Hash[];
  /**
   * The sum of all transactions costs
   */
  cyclesUsed: Uint64[];
  /**
   * The height to which the block has been executed
   */
  execHeight: Uint64;
  /**
   * block height
   */
  height: Uint64;
  /**
   * The merkle root of ordered transactions
   */
  orderRoot: Hash;
  /**
   * The hash of ordered signed transactions
   */
  orderSignedTransactionsHash: Hash;
  /**
   * The hash of the serialized previous block
   */
  prevHash: Hash;
  proof: Proof;
  /**
   * The address descirbed who packed the block
   */
  proposer: Address;
  /**
   * The merkle roots of receipts
   */
  receiptRoot: Hash[];
  /**
   * The merkle root of state root
   */
  stateRoot: Hash;
  /**
   * A timestamp that records when the block was created
   */
  timestamp: Uint64;
  /**
   * The version of validator is designed for cross chain
   */
  validatorVersion: Uint64;
  validators: Validator[];
}

/**
 * The verifier of the block header proved
 * Overload runs likes tendermint, which means in one Block, there may be more than one **round** to achieve consensus,
 */
export interface Proof {
  height: Hex;
  round: Hex;
  blockHash: Hash;
  signature: Bytes;
  bitmap: Bytes;
}

/**
 * Validator address, contains its propose weight and vote weight
 */
export interface Validator {
  address: Address;
  proposeWeight: Int;
  voteWeight: Int;
}

/**
 * A transaction often require computing resources or write data to chain,
 * these resources are valuable so we need to pay some token for them.
 * Transaction describes information above
 *
 * The transaction is not signed yet
 *
 * you may stuff this by [[prepareTransaction]]
 */
export interface Transaction {
  chainId: Hash;

  cyclesLimit: Uint64;

  cyclesPrice: Uint64;

  nonce: Hash;

  timeout: Uint64;

  serviceName: string;

  method: string;

  payload: string;

  sender: Address;
}

/**
 * Signature of the transaction, this should not be used separately
 * you may sign it by [[signTransaction]]
 */
export interface TransactionSignature {
  txHash: Hash;
  pubkey: Bytes;
  signature: Bytes;
}

/**
 * SignedTransaction, contains all info from [[Transaction]] and [[TransactionSignature]]
 * you may sign it by [[signTransaction]]
 */
export interface SignedTransaction {
  chainId: Hash;
  cyclesLimit: Uint64;
  cyclesPrice: Uint64;
  nonce: Hash;
  timeout: Uint64;
  serviceName: string;
  method: string;
  payload: string;
  txHash: Hash;
  pubkey: Bytes;
  signature: Bytes;
  sender: Address;
}

export interface InputSignedTransaction {
  inputRaw: Transaction;
  inputEncryption: TransactionSignature;
}

/**
 * the Receipt data structure, receipt represent a handler or response with submitted transactions
 * see [[Event]] and [[ReceiptResponse]] for more details
 * see [[getReceipt]] for more details
 */
export interface Receipt<Ret = string> {
  stateRoot: Hash;
  height: string;
  txHash: Hash;
  cyclesUsed: Uint64;
  events: Event[];
  response: ReceiptResponse<Ret>;
}

/**
 * the details response for a committed [[Transaction]]
 * serviceName and method should equals submitted [[Transaction]]
 */
export interface ReceiptResponse<Ret = string> {
  serviceName: string;
  method: string;
  response: ServiceResponse<Ret>;
}

export interface ServiceResponse<Data = string> {
  code: Uint64;
  errorMessage: string;
  succeedData: Data;
}

/**
 * The service will emit events during execution for debugging or tracking,
 * or for other purposes. It will be included in {@link Receipt}
 */
export interface Event<T = string> {
  service: string;
  data: T;
}
