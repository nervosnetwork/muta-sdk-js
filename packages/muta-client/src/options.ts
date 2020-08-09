import { Account } from '@mutadev/account';
import { DefaultVariables } from '@mutadev/defaults';
import { Address, Uint64 } from '@mutadev/types';
import { defaultSerializer, Serializer } from './transform';

/**
 * the preset {@link ClientOption} when you construct {@link Client}
 * you may manually construct by Construct
 * or from Muta's {@link Client}
 */
export interface ClientOption {
  endpoint: string;

  chainId: string;

  /**
   * default caller field in {@link Client.queryService}
   */
  defaultCaller: Address;

  /**
   * Warning, this configuration is likely to be deprecated in the future.
   * {@link Transaction.cyclesLimit}
   */
  defaultCyclesLimit: Uint64;

  /**
   * Warning, this configuration is likely to be deprecated in the future.
   * {@link Transaction.cyclesPrice}
   */
  defaultCyclesPrice: Uint64;

  /**
   * Muta's timeout_gap
   */
  timeoutGap: number;

  /**
   * Muta's consensus_interval
   */
  consensusInterval: number;

  /**
   * this value indicates the maximum waiting time
   * for the client to wait for the response
   */
  maxTimeout: number;

  /**
   * This account will be used to sign the Transaction if it is found
   * that it has not been signed during {@link Client.sendTransaction}.
   */
  account?: Account;

  serializer: Serializer;
}

export function getDefaultClientOption(): ClientOption {
  return {
    endpoint: DefaultVariables.get('MUTA_ENDPOINT'),
    chainId: DefaultVariables.get('MUTA_CHAIN_ID'),
    defaultCyclesPrice: '0xffffff',
    defaultCyclesLimit: '0xffffff',
    defaultCaller: DefaultVariables.get('MUTA_GRAPHQL_CALLER'),
    maxTimeout: 60000,
    timeoutGap: DefaultVariables.get('MUTA_TIMEOUT_GAP'),
    consensusInterval: DefaultVariables.get('MUTA_CONSENSUS_INTERVAL'),
    serializer: defaultSerializer,
  };
}
