import { Address, Bytes, Hash, Int, Maybe, Uint64, Vec } from './scalar';

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
   * the chain id
   */
  chainId: Hash;

  /**
   * block height
   */
  height: Uint64;

  /**
   * prev block hash
   */
  preHash: Hash;

  /**
   * the time tim
   */
  timestamp: Uint64;

  /**
   * the Merkle root of the ordered transactions
   */
  orderRoot: Hash;

  /**
   *
   */
  confirmRoot: string[];

  /**
   *
   */
  stateRoot: string;

  /**
   *
   */
  receiptRoot: Hash[];

  /**
   *
   */
  cyclesUsed: Uint64[];

  /**
   *
   */
  proposer: string;

  proof: Proof;

  /**
   *
   */
  validatorVersion: Uint64;

  /**
   *
   */
  validators: Validator[];
}

/**
 * The verifier of the block header proved
 * Overload runs likes tendermint, which means in one Block, there may be more than one **round** to achieve consensus,
 */
export interface Proof {
  height: string;
  round: string;
  blockHash: string;
  signature: string;
  bitmap: string;
}

/**
 * Validator address, contains its propose weight and vote weight
 */
export interface Validator {
  address: string;
  proposeWeight: Int;
  voteWeight: Int;
}

/**
 * represent the answer of query_service graphql_rpc or [[queryService]] in Client
 * compare to [[ExecRespDyn]] with generic
 * @param ret  the raw data returns by service, maybe need decoding
 */
// export interface ExecResp<Ret = any> {
//   ret: Ret;
//   isError: boolean;
// }

/**
 * A transaction often require computing resources or write data to chain,
 * these resources are valuable so we need to pay some token for them.
 * Transaction describes information above
 *
 */
export interface Transaction<P> {
  chainId: Hash;

  cyclesLimit: Uint64;

  cyclesPrice: Uint64;

  nonce: Bytes;

  timeout: Uint64;

  serviceName: string;

  method: string;

  payload: P;
}

type SerializedTransaction = Transaction<string>;

export interface Witness {
  pubkeys: Vec<Bytes>;
  signatures: Vec<Bytes>;
  signatureType: number;
}

/**
 * now the serialized witness is a string with JSON format
 */
type SerializedWitness = string;

/**
 * SignedTransaction, contains all info from [[Transaction]] and [[TransactionSignature]]
 * you may sign it by [[signTransaction]]
 */
export interface SignedTransaction {
  raw: SerializedTransaction;
  txHash: Hash;
  witness: SerializedWitness;
}

export interface DeSerializedSignedTransaction<P> {
  raw: Transaction<P>;
  txHash: Hash;
  witness: Witness;
}

/**
 * data structure when you call [[queryService]] to chain
 * compare to [[ServicePayload]], which enables generic for 'payload'
 *
 * @deprecated
 */
export interface QueryServiceParam<P = any> {
  serviceName: string;
  method: string;
  payload: P;
  height?: Maybe<string>;
  caller?: Maybe<string>;
  cyclePrice?: Maybe<string>;
  cycleLimit?: Maybe<string>;
}

/**
 * data structure when you call [[getBlock]] to chain
 * @param height , note that this could be null
 * @deprecated
 */
export interface QueryBlockParam {
  height?: Maybe<string>;
}

/**
 * the Receipt data structure, receipt represent a handler or response with submitted transactions
 * see [[Event]] and [[ReceiptResponse]] for more details
 * see [[getReceipt]] for more details
 */
export interface Receipt<Ret = any> {
  stateRoot: Hash;
  height: Uint64;
  txHash: Hash;
  cyclesUsed: Uint64;
  events: Event[];
  response: ReceiptResponse<Ret>;
}

/**
 * the details response for a committed [[Transaction]]
 * serviceName and method should equals submitted [[Transaction]]
 */
export interface ReceiptResponse<Ret = any> {
  serviceName: string;
  method: string;
  response: ServiceResponse<Ret>;
}

/**
 * the ServicePayload data structure when you call [[queryServiceDyn]]
 * compare to [[QueryServiceParam]], which disables generic
 */
export interface ServicePayload<P> {
  height?: Uint64;
  cyclesLimit?: Uint64;
  cyclesPrice?: Uint64;
  caller?: Address;
  serviceName: string;
  method: string;
  payload: P;
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
