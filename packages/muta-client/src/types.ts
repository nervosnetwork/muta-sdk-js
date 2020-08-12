import { Address, Maybe, Uint64 } from '@mutadev/types';

/**
 * data structure when you call [[queryService]] to chain
 * compare to [[ServicePayload]], which enables generic for 'payload'
 */
export interface QueryServiceParam<P = string> {
  serviceName: string;
  method: string;
  payload: P;
  height?: Maybe<string>;
  caller?: Maybe<Address>;
  cyclePrice?: Maybe<Uint64>;
  cycleLimit?: Maybe<Uint64>;
}

/**
 * give those params,
 * the client will {@link composeTransaction]] with default info in [[ClientOption} for you
 */
export interface ComposeTransactionParam<P> {
  cyclesPrice?: Uint64;
  cyclesLimit?: Uint64;
  timeout?: Uint64;
  serviceName: string;
  method: string;
  payload: P;
  sender?: Address;
}
