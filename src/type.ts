// @ts-ignore

import * as sdk from './client/codegen/sdk';

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

export interface ServicePayload<P> {
  height?: Uint64;
  cyclesLimit?: Uint64;
  cyclesPrice?: Uint64;
  caller?: Address;
  serviceName: string;
  method: string;
  payload: P;
}

export interface ExecRespDyn<R> {
  ret: R;
  isError: Scalars['Boolean'];
}
