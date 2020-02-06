// @ts-ignore

import * as sdk from '../client/codegen/sdk';

export type Scalars = sdk.Scalars;

export type ID = Scalars['ID'];
export type Uint64 = Scalars['Uint64'];
export type Hash = Scalars['Hash'];
export type Address = Scalars['Address'];
export type Bytes = Scalars['Bytes'];

export type Event = sdk.Event;
export type Block = sdk.Block;
export type BlockHeader = sdk.BlockHeader;
export type ExecResp = sdk.ExecResp;
export type Transaction = sdk.InputRawTransaction;
export type TransactionSignature = sdk.InputTransactionEncryption;
export type SignedTransaction = sdk.SignedTransaction;
export type QueryServiceQueryParam = sdk.QueryServiceQueryVariables;

export type QueryBlockParam = sdk.QueryGetBlockArgs;
export type QueryTransactionParam = Hash;
export type Receipt = sdk.Receipt;


interface ServicePayload<P> {
  height?: Uint64;
  cyclesLimit?: Uint64;
  cyclesPrice?: Uint64;
  caller?: Address;
  serviceName: string;
  method: string;
  payload: P;
}

interface ExecRespDyn<R> {
  ret: R;
  isError: Scalars['Boolean'];
}

/*
type Hex = string;
type Hash = Hex;
type Bytes = Hex;
type Uint64 = Hex;
// Account address is a 21 bytes, and starts with 0x
type Address = Hex;


export interface GetBlockParam{
  height: Maybe<Uint64>
}


/!**
 * The signature
 *!/
export interface TransactionSignature {
  txHash: Hash;
  pubkey: Bytes;
  signature: Bytes;
}

export interface TransactionParam<PLD extends string | object> {
  chainId: Hash;
  cyclesLimit: Uint64;
  cyclesPrice: Uint64;
  nonce: Hash;
  timeout: Uint64;
  serviceName: string;
  method: string;
  payload: PLD;
}

export interface SignedTransaction<PLD extends string | object> {
  inputRaw: TransactionParam<PLD>;
  inputEncryption: TransactionSignature;
}

export interface Block{
  header: BlockHeader,
  orderedTxHashes : Hash[]
}

export interface BlockHeader{
  chainId: Hash,
  height: Uint64,
  preHash: Hash,
  timestamp: Uint64,
  orderRoot: Hash,
  confirmRoot: Hash[],
  stateRoot: Hash,
  receiptRoot: Hash[],
  cyclesUsed: Uint64[],
  proposer: Address,
  proof: Proof,
  validatorVersion: Uint64,
  validators: Validator[],
}

export interface  Proof {
  height: Uint64,
  round: Uint64,
  blockHash: Hash,
  signature: Bytes,
  bitmap: Bytes,
}

export interface Validator {
  address: Address,
  proposeWeight: number,
  voteWeight: number,
}

export interface QueryServiceParam<PLD extends string | object> {
  height?: Uint64;
  cyclesLimit?: Uint64;
  cyclesPrice?: Uint64;
  caller?: Address;
  serviceName: string;
  method: string;
  payload: PLD;
}

export interface ExecResp  {
  ret: string,
  isError: boolean,
}

export interface Receipt {
  stateRoot: Hash,
  height: Uint64,
  txHash: Hash,
  cyclesUsed: Uint64,
  events: Event[],
  response: ReceiptResponse,
}
*/
