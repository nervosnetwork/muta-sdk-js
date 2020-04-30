import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Bytes corresponding hex string. */
  Bytes: string;
  /** 20 bytes of account address */
  Address: string;
  /** The output digest of Keccak hash function */
  Hash: string;
  /** Uint64 */
  Uint64: string;
};

export type Event = {
   __typename?: 'Event';
  service: Scalars['String'];
  topic: Scalars['String'];
  data: Scalars['String'];
};


/** The verifier of the block header proved */
export type Proof = {
   __typename?: 'Proof';
  height: Scalars['Uint64'];
  round: Scalars['Uint64'];
  blockHash: Scalars['Hash'];
  signature: Scalars['Bytes'];
  bitmap: Scalars['Bytes'];
};

/** Description a service interface and events */
export type ServiceSchema = {
   __typename?: 'ServiceSchema';
  /** name of service */
  service: Scalars['String'];
  /** service methods, method payloads and response */
  method: Scalars['String'];
  /** all events emitted by service */
  event: Scalars['String'];
};


/** Signature of the transaction */
export type InputTransactionEncryption = {
  /** The digest of the transaction */
  txHash: Scalars['Hash'];
  /** The public key of transfer */
  pubkey: Scalars['Bytes'];
  /** The signature of the transaction */
  signature: Scalars['Bytes'];
};

export type Mutation = {
   __typename?: 'Mutation';
  /** send transaction */
  sendTransaction: Scalars['Hash'];
  /** @deprecated DON'T use it in production! This is just for development. */
  unsafeSendTransaction: Scalars['Hash'];
};


export type MutationSendTransactionArgs = {
  inputRaw: InputRawTransaction;
  inputEncryption: InputTransactionEncryption;
};


export type MutationUnsafeSendTransactionArgs = {
  inputRaw: InputRawTransaction;
  inputPrivkey: Scalars['Bytes'];
};


/** ChainSchema consists of all service schemas */
export type ChainSchema = {
   __typename?: 'ChainSchema';
  schema: Array<ServiceSchema>;
};

export type Query = {
   __typename?: 'Query';
  /** Get the block */
  getBlock: Block;
  /** Get the transaction by hash */
  getTransaction: SignedTransaction;
  /** Get the receipt by transaction hash */
  getReceipt: Receipt;
  /** query service */
  queryService: ServiceResponse;
  /** Get all services schema, including service methods and events */
  getSchema: ChainSchema;
};


export type QueryGetBlockArgs = {
  height?: Maybe<Scalars['Uint64']>;
};


export type QueryGetTransactionArgs = {
  txHash: Scalars['Hash'];
};


export type QueryGetReceiptArgs = {
  txHash: Scalars['Hash'];
};


export type QueryQueryServiceArgs = {
  height?: Maybe<Scalars['Uint64']>;
  cyclesLimit?: Maybe<Scalars['Uint64']>;
  cyclesPrice?: Maybe<Scalars['Uint64']>;
  caller: Scalars['Address'];
  serviceName: Scalars['String'];
  method: Scalars['String'];
  payload: Scalars['String'];
};

export type Receipt = {
   __typename?: 'Receipt';
  stateRoot: Scalars['Hash'];
  height: Scalars['Uint64'];
  txHash: Scalars['Hash'];
  cyclesUsed: Scalars['Uint64'];
  events: Array<Event>;
  response: ReceiptResponse;
};

export type ReceiptResponse = {
   __typename?: 'ReceiptResponse';
  serviceName: Scalars['String'];
  method: Scalars['String'];
  response: ServiceResponse;
};


export type SignedTransaction = {
   __typename?: 'SignedTransaction';
  chainId: Scalars['Hash'];
  cyclesLimit: Scalars['Uint64'];
  cyclesPrice: Scalars['Uint64'];
  nonce: Scalars['Hash'];
  timeout: Scalars['Uint64'];
  serviceName: Scalars['String'];
  method: Scalars['String'];
  payload: Scalars['String'];
  txHash: Scalars['Hash'];
  pubkey: Scalars['Bytes'];
  signature: Scalars['Bytes'];
};

/** Block is a single digital record created within a blockchain. Each block contains a record of the previous Block, and when linked together these become the “chain”.A block is always composed of header and body. */
export type Block = {
   __typename?: 'Block';
  /** The header section of a block */
  header: BlockHeader;
  /** The body section of a block */
  orderedTxHashes: Array<Scalars['Hash']>;
  /** Hash of the block */
  hash: Scalars['Hash'];
};

/** Validator address set */
export type Validator = {
   __typename?: 'Validator';
  address: Scalars['Address'];
  proposeWeight: Scalars['Int'];
  voteWeight: Scalars['Int'];
};

/** A block header is like the metadata of a block. */
export type BlockHeader = {
   __typename?: 'BlockHeader';
  /** Identifier of a chain in order to prevent replay attacks across channels  */
  chainId: Scalars['Hash'];
  /** block height */
  height: Scalars['Uint64'];
  /** The height to which the block has been executed */
  execHeight: Scalars['Uint64'];
  /** The hash of the serialized previous block */
  preHash: Scalars['Hash'];
  /** A timestamp that records when the block was created */
  timestamp: Scalars['Uint64'];
  /** The merkle root of ordered transactions */
  orderRoot: Scalars['Hash'];
  /** The merkle roots of all the confirms */
  confirmRoot: Array<Scalars['Hash']>;
  /** The merkle root of state root */
  stateRoot: Scalars['Hash'];
  /** The merkle roots of receipts */
  receiptRoot: Array<Scalars['Hash']>;
  /** The sum of all transactions costs */
  cyclesUsed: Array<Scalars['Uint64']>;
  /** The address descirbed who packed the block */
  proposer: Scalars['Address'];
  proof: Proof;
  /** The version of validator is designed for cross chain */
  validatorVersion: Scalars['Uint64'];
  validators: Array<Validator>;
};

export type ServiceResponse = {
   __typename?: 'ServiceResponse';
  code: Scalars['Uint64'];
  succeedData: Scalars['String'];
  errorMessage: Scalars['String'];
};

/** There was many types of transaction in Muta, A transaction often require computing resources or write data to chain,these resources are valuable so we need to pay some token for them.InputRawTransaction describes information above */
export type InputRawTransaction = {
  /** Identifier of the chain. */
  chainId: Scalars['Hash'];
  /** Mostly like the gas limit in Ethereum, describes the fee that you are willing to pay the highest price for the transaction */
  cyclesLimit: Scalars['Uint64'];
  cyclesPrice: Scalars['Uint64'];
  /** Every transaction has its own id, unlike Ethereum's nonce,the nonce in Muta is an hash */
  nonce: Scalars['Hash'];
  /** For security and performance reasons, Muta will only deal with trade request over a period of time,the `timeout` should be `timeout > current_block_height` and `timeout < current_block_height + timeout_gap`,the `timeout_gap` generally equal to 20. */
  timeout: Scalars['Uint64'];
  serviceName: Scalars['String'];
  method: Scalars['String'];
  payload: Scalars['String'];
};

export type QueryServiceQueryVariables = {
  serviceName: Scalars['String'];
  method: Scalars['String'];
  payload: Scalars['String'];
  height?: Maybe<Scalars['Uint64']>;
  caller?: Maybe<Scalars['Address']>;
  cyclePrice?: Maybe<Scalars['Uint64']>;
  cycleLimit?: Maybe<Scalars['Uint64']>;
};


export type QueryServiceQuery = (
  { __typename?: 'Query' }
  & { queryService: (
    { __typename?: 'ServiceResponse' }
    & Pick<ServiceResponse, 'code' | 'errorMessage' | 'succeedData'>
  ) }
);

export type SendTransactionMutationVariables = {
  inputRaw: InputRawTransaction;
  inputEncryption: InputTransactionEncryption;
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
  txHash: Scalars['Hash'];
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
  txHash: Scalars['Hash'];
};


export type GetReceiptQuery = (
  { __typename?: 'Query' }
  & { getReceipt: (
    { __typename?: 'Receipt' }
    & Pick<Receipt, 'txHash' | 'height' | 'cyclesUsed' | 'stateRoot'>
    & { events: Array<(
      { __typename?: 'Event' }
      & Pick<Event, 'data' | 'service' | 'topic'>
    )>, response: (
      { __typename?: 'ReceiptResponse' }
      & Pick<ReceiptResponse, 'serviceName' | 'method'>
      & { response: (
        { __typename?: 'ServiceResponse' }
        & Pick<ServiceResponse, 'code' | 'errorMessage' | 'succeedData'>
      ) }
    ) }
  ) }
);

export type GetBlockQueryVariables = {
  height?: Maybe<Scalars['Uint64']>;
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
    query queryService($serviceName: String!, $method: String!, $payload: String!, $height: Uint64, $caller: Address = "0x0000000000000000000000000000000000000000", $cyclePrice: Uint64, $cycleLimit: Uint64) {
  queryService(height: $height, serviceName: $serviceName, method: $method, payload: $payload, caller: $caller, cyclesPrice: $cyclePrice, cyclesLimit: $cycleLimit) {
    code
    errorMessage
    succeedData
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
      topic
    }
    stateRoot
    response {
      serviceName
      method
      response {
        code
        errorMessage
        succeedData
      }
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

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    queryService(variables: QueryServiceQueryVariables): Promise<QueryServiceQuery> {
      return withWrapper(() => client.request<QueryServiceQuery>(print(QueryServiceDocument), variables));
    },
    sendTransaction(variables: SendTransactionMutationVariables): Promise<SendTransactionMutation> {
      return withWrapper(() => client.request<SendTransactionMutation>(print(SendTransactionDocument), variables));
    },
    getTransaction(variables: GetTransactionQueryVariables): Promise<GetTransactionQuery> {
      return withWrapper(() => client.request<GetTransactionQuery>(print(GetTransactionDocument), variables));
    },
    getReceipt(variables: GetReceiptQueryVariables): Promise<GetReceiptQuery> {
      return withWrapper(() => client.request<GetReceiptQuery>(print(GetReceiptDocument), variables));
    },
    getBlock(variables?: GetBlockQueryVariables): Promise<GetBlockQuery> {
      return withWrapper(() => client.request<GetBlockQuery>(print(GetBlockDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;