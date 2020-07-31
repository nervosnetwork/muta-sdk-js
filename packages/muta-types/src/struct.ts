import { Address, Bytes, Hash, Int, Uint64 } from './scalar';

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
  height: Uint64;
  round: Uint64;
  blockHash: Hash;
  signature: Bytes;
  bitmap: Bytes;
}

/**
 * Validator
 */
export interface Validator {
  pubkey: Bytes;
  proposeWeight: Int;
  voteWeight: Int;
}

/**
 * Transaction is a means of changing the state of the chain, for example,
 * Alice transfers to Bob, which actually decreases an asset in Alice's account
 * and increases an asset in Bob's account.
 *
 * Each Transaction is atomic, i.e., either all state changes caused by
 * this Transaction are executed or none are executed
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
  data: T;
  name: string;
  service: string;
}
