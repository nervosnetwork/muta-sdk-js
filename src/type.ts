/**
 * ID, string
 */
export type ID = string;
/**
 * a 64bits number, represented by string
 */
export type Uint64 = string;
/**
 * a hash, represented by string, not sure the real length
 */
export type Hash = string;
/**
 * an address, represented by string, normally 42 char-length ('0x' takes 2 and the paylaod 20 bytes takes 40) for secp256k1
 */
export type Address = string;
/**
 * a short hand for string
 */
export type Bytes = string;
/**
 * a short hand for number
 */
export type Int = number;
/**
 * something like Option<T>
 */
export type Maybe<T> = T | null;

/**
 * represents the events logged in txs
 * see [[Receipt]]
 */
export interface Event {
  service: string;
  data: string;
}

/**
 * the Block data structure in Muta chain
 * see [[BlockHeader]]
 */
export interface Block {
  header: BlockHeader;
  orderedTxHashes: string[];
}

/**
 * the Block header
 * cause the Overlord consensus detachs the Replica State Machine and the Ordering fo Consensus
 * so the tx ordered and tx committed(runs properly and commit changes to state machine) may differ
 */
export interface BlockHeader {
  chainId: string;
  height: string;
  preHash: string;
  timestamp: string;
  orderRoot: string;
  confirmRoot: string[];
  stateRoot: string;
  receiptRoot: Hash[];
  cyclesUsed: Uint64[];
  proposer: string;
  proof: Proof;
  validatorVersion: string;
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
export interface ExecResp {
  ret: string;
  isError: boolean;
}

/**
 * There was many types of transaction in Muta,
 * A transaction often require computing resources or write data to chain,
 * these resources are valuable so we need to pay some token for them.
 * Transaction describes information above
 *
 * The transaction is not signed yet
 *
 * you may stuff this by [[prepareTransaction]]
 */
export interface Transaction {
  chainId: string;
  cyclesLimit: string;
  cyclesPrice: string;
  nonce: string;
  timeout: string;
  serviceName: string;
  method: string;
  payload: string;
}

/**
 * Signature of the transaction, this should not be used separately
 * you may sign it by [[signTransaction]]
 */
export interface TransactionSignature {
  txHash: string;
  pubkey: string;
  signature: string;
}

/**
 * SignedTransaction, contains all info from [[Transaction]] and [[TransactionSignature]]
 * you may sign it by [[signTransaction]]
 */
export interface SignedTransaction {
  chainId: string;
  cyclesLimit: string;
  cyclesPrice: string;
  nonce: string;
  timeout: string;
  serviceName: string;
  method: string;
  payload: string;
  txHash: string;
  pubkey: string;
  signature: string;
}

export interface InputSignedTransaction {
  inputRaw: Transaction;
  inputEncryption: TransactionSignature;
}

/**
 * data structure when you call [[queryService]] to chain
 * compare to [[ServicePayload]], which enables generic for 'payload'
 */
export interface QueryServiceParam<P = string> {
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
 */
export interface QueryBlockParam {
  height?: Maybe<string>;
}

/**
 * data structure when you
 */
// export type QueryTransactionParam = Hash;

/**
 * the Receipt data structure, receipt represent a handler or response with submitted transactions
 * see [[Event]] and [[ReceiptResponse]] for more details
 * see [[getReceipt]] for more details
 */
export interface Receipt<Ret = string> {
  stateRoot: string;
  height: string;
  txHash: string;
  cyclesUsed: string;
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
  ret: Ret;
  isError: boolean;
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

/**
 * ExecResp with generic, when you call [[queryServiceDyn]]
 * compare to [[ExecResp]] without generic
 */
export interface ExecRespDyn<R> {
  ret: R;
  isError: boolean;
}
