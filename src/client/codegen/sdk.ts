import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Uint64: string,
  Hash: string,
  Address: string,
  Bytes: string,
};


export type Block = {
   __typename?: 'Block',
  header: BlockHeader,
  orderedTxHashes: Array<Scalars['Hash']>,
  hash: Scalars['Hash'],
};

export type BlockHeader = {
   __typename?: 'BlockHeader',
  chainId: Scalars['Hash'],
  height: Scalars['Uint64'],
  execHeight: Scalars['Uint64'],
  preHash: Scalars['Hash'],
  timestamp: Scalars['Uint64'],
  orderRoot: Scalars['Hash'],
  confirmRoot: Array<Scalars['Hash']>,
  stateRoot: Scalars['Hash'],
  receiptRoot: Array<Scalars['Hash']>,
  cyclesUsed: Array<Scalars['Uint64']>,
  proposer: Scalars['Address'],
  proof: Proof,
  validatorVersion: Scalars['Uint64'],
  validators: Array<Validator>,
};


export type Event = {
   __typename?: 'Event',
  service: Scalars['String'],
  data: Scalars['String'],
};

export type ExecResp = {
   __typename?: 'ExecResp',
  ret: Scalars['String'],
  isError: Scalars['Boolean'],
};


export type InputRawTransaction = {
  chainId: Scalars['Hash'],
  cyclesLimit: Scalars['Uint64'],
  cyclesPrice: Scalars['Uint64'],
  nonce: Scalars['Hash'],
  timeout: Scalars['Uint64'],
  serviceName: Scalars['String'],
  method: Scalars['String'],
  payload: Scalars['String'],
};

export type InputTransactionEncryption = {
  txHash: Scalars['Hash'],
  pubkey: Scalars['Bytes'],
  signature: Scalars['Bytes'],
};

export type Mutation = {
   __typename?: 'Mutation',
  sendTransaction: Scalars['Hash'],
  unsafeSendTransaction: Scalars['Hash'],
};


export type MutationSendTransactionArgs = {
  inputRaw: InputRawTransaction,
  inputEncryption: InputTransactionEncryption
};


export type MutationUnsafeSendTransactionArgs = {
  inputRaw: InputRawTransaction,
  inputPrivkey: Scalars['Bytes']
};

export type Proof = {
   __typename?: 'Proof',
  height: Scalars['Uint64'],
  round: Scalars['Uint64'],
  blockHash: Scalars['Hash'],
  signature: Scalars['Bytes'],
  bitmap: Scalars['Bytes'],
};

export type Query = {
   __typename?: 'Query',
  getBlock: Block,
  getTransaction: SignedTransaction,
  getReceipt: Receipt,
  queryService: ExecResp,
};


export type QueryGetBlockArgs = {
  height?: Maybe<Scalars['Uint64']>
};


export type QueryGetTransactionArgs = {
  txHash: Scalars['Hash']
};


export type QueryGetReceiptArgs = {
  txHash: Scalars['Hash']
};


export type QueryQueryServiceArgs = {
  height?: Maybe<Scalars['Uint64']>,
  cyclesLimit?: Maybe<Scalars['Uint64']>,
  cyclesPrice?: Maybe<Scalars['Uint64']>,
  caller: Scalars['Address'],
  serviceName: Scalars['String'],
  method: Scalars['String'],
  payload: Scalars['String']
};

export type Receipt = {
   __typename?: 'Receipt',
  stateRoot: Scalars['Hash'],
  height: Scalars['Uint64'],
  txHash: Scalars['Hash'],
  cyclesUsed: Scalars['Uint64'],
  events: Array<Event>,
  response: ReceiptResponse,
};

export type ReceiptResponse = {
   __typename?: 'ReceiptResponse',
  serviceName: Scalars['String'],
  method: Scalars['String'],
  ret: Scalars['String'],
  isError: Scalars['Boolean'],
};

export type SignedTransaction = {
   __typename?: 'SignedTransaction',
  chainId: Scalars['Hash'],
  cyclesLimit: Scalars['Uint64'],
  cyclesPrice: Scalars['Uint64'],
  nonce: Scalars['Hash'],
  timeout: Scalars['Uint64'],
  serviceName: Scalars['String'],
  method: Scalars['String'],
  payload: Scalars['String'],
  txHash: Scalars['Hash'],
  pubkey: Scalars['Bytes'],
  signature: Scalars['Bytes'],
};


export type Validator = {
   __typename?: 'Validator',
  address: Scalars['Address'],
  proposeWeight: Scalars['Int'],
  voteWeight: Scalars['Int'],
};

export type QueryServiceQueryVariables = {
  serviceName: Scalars['String'],
  method: Scalars['String'],
  payload: Scalars['String'],
  height?: Maybe<Scalars['Uint64']>,
  caller?: Maybe<Scalars['Address']>,
  cyclePrice?: Maybe<Scalars['Uint64']>,
  cycleLimit?: Maybe<Scalars['Uint64']>
};


export type QueryServiceQuery = (
  { __typename?: 'Query' }
  & { queryService: (
    { __typename?: 'ExecResp' }
    & Pick<ExecResp, 'isError' | 'ret'>
  ) }
);

export type SendTransactionMutationVariables = {
  inputRaw: InputRawTransaction,
  inputEncryption: InputTransactionEncryption
};


export type SendTransactionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendTransaction'>
);

export type ServicePayloadFragment = (
  { __typename?: 'SignedTransaction' }
  & Pick<SignedTransaction, 'serviceName' | 'method' | 'payload'>
);

export type GetTransactionQueryVariables = {
  txHash: Scalars['Hash']
};


export type GetTransactionQuery = (
  { __typename?: 'Query' }
  & { getTransaction: (
    { __typename?: 'SignedTransaction' }
    & Pick<SignedTransaction, 'nonce' | 'chainId' | 'cyclesLimit' | 'cyclesPrice' | 'timeout' | 'txHash' | 'pubkey' | 'signature'>
    & ServicePayloadFragment
  ) }
);

export type GetReceiptQueryVariables = {
  txHash: Scalars['Hash']
};


export type GetReceiptQuery = (
  { __typename?: 'Query' }
  & { getReceipt: (
    { __typename?: 'Receipt' }
    & Pick<Receipt, 'txHash' | 'height' | 'cyclesUsed' | 'stateRoot'>
    & { events: Array<(
      { __typename?: 'Event' }
      & Pick<Event, 'data' | 'service'>
    )>, response: (
      { __typename?: 'ReceiptResponse' }
      & Pick<ReceiptResponse, 'serviceName' | 'method' | 'ret' | 'isError'>
    ) }
  ) }
);

export type GetBlockQueryVariables = {
  height?: Maybe<Scalars['Uint64']>
};


export type GetBlockQuery = (
  { __typename?: 'Query' }
  & { getBlock: (
    { __typename?: 'Block' }
    & Pick<Block, 'orderedTxHashes' | 'hash'>
    & { header: (
      { __typename?: 'BlockHeader' }
      & Pick<BlockHeader, 'chainId' | 'confirmRoot' | 'cyclesUsed' | 'height' | 'execHeight' | 'orderRoot' | 'preHash' | 'proposer' | 'receiptRoot' | 'stateRoot' | 'timestamp' | 'validatorVersion'>
      & { proof: (
        { __typename?: 'Proof' }
        & Pick<Proof, 'bitmap' | 'blockHash' | 'height' | 'round' | 'signature'>
      ), validators: Array<(
        { __typename?: 'Validator' }
        & Pick<Validator, 'address' | 'proposeWeight' | 'voteWeight'>
      )> }
    ) }
  ) }
);

export const ServicePayloadFragmentDoc = gql`
    fragment ServicePayload on SignedTransaction {
  serviceName
  method
  payload
}
    `;
export const QueryServiceDocument = gql`
    query queryService($serviceName: String!, $method: String!, $payload: String!, $height: Uint64, $caller: Address = "0x1000000000000000000000000000000000000000", $cyclePrice: Uint64, $cycleLimit: Uint64) {
  queryService(height: $height, serviceName: $serviceName, method: $method, payload: $payload, caller: $caller, cyclesPrice: $cyclePrice, cyclesLimit: $cycleLimit) {
    isError
    ret
  }
}
    `;
export const SendTransactionDocument = gql`
    mutation sendTransaction($inputRaw: InputRawTransaction!, $inputEncryption: InputTransactionEncryption!) {
  sendTransaction(inputRaw: $inputRaw, inputEncryption: $inputEncryption)
}
    `;
export const GetTransactionDocument = gql`
    query getTransaction($txHash: Hash!) {
  getTransaction(txHash: $txHash) {
    ...ServicePayload
    nonce
    chainId
    cyclesLimit
    cyclesPrice
    timeout
    txHash
    pubkey
    signature
  }
}
    ${ServicePayloadFragmentDoc}`;
export const GetReceiptDocument = gql`
    query getReceipt($txHash: Hash!) {
  getReceipt(txHash: $txHash) {
    txHash
    height
    cyclesUsed
    events {
      data
      service
    }
    stateRoot
    response {
      serviceName
      method
      ret
      isError
    }
  }
}
    `;
export const GetBlockDocument = gql`
    query getBlock($height: Uint64) {
  getBlock(height: $height) {
    header {
      chainId
      confirmRoot
      cyclesUsed
      height
      execHeight
      orderRoot
      preHash
      proposer
      receiptRoot
      stateRoot
      timestamp
      validatorVersion
      proof {
        bitmap
        blockHash
        height
        round
        signature
      }
      validators {
        address
        proposeWeight
        voteWeight
      }
    }
    orderedTxHashes
    hash
  }
}
    `;
export function getSdk(client: GraphQLClient) {
  return {
    queryService(variables: QueryServiceQueryVariables): Promise<QueryServiceQuery> {
      return client.request<QueryServiceQuery>(print(QueryServiceDocument), variables);
    },
    sendTransaction(variables: SendTransactionMutationVariables): Promise<SendTransactionMutation> {
      return client.request<SendTransactionMutation>(print(SendTransactionDocument), variables);
    },
    getTransaction(variables: GetTransactionQueryVariables): Promise<GetTransactionQuery> {
      return client.request<GetTransactionQuery>(print(GetTransactionDocument), variables);
    },
    getReceipt(variables: GetReceiptQueryVariables): Promise<GetReceiptQuery> {
      return client.request<GetReceiptQuery>(print(GetReceiptDocument), variables);
    },
    getBlock(variables?: GetBlockQueryVariables): Promise<GetBlockQuery> {
      return client.request<GetBlockQuery>(print(GetBlockDocument), variables);
    }
  };
}