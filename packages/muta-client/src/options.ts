import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_ENDPOINT,
  DEFAULT_TIMEOUT_GAP,
} from '@mutadev/defaults';
import { Uint64 } from '@mutadev/types';

/**
 * the preset [[ClientOption]] when you construct [[Client]]
 * you may manually construct by Construct
 * or from Muta's [[client]]
 */
export interface ClientOption {
  /**
   * {@link MutaContext.endpoint}
   */
  endpoint: string;

  /**
   * {@link MutaContext.chainId}
   */
  chainId: string;

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
   * {@link MutaContext.timeoutGap}
   */
  timeoutGap: number;

  /**
   * {@link MutaContext.consensusInterval}
   */
  consensusInterval: number;

  /**
   * This value indicates the maximum waiting time for the client to wait for the response
   */
  maxTimeout: number;
}

export function getDefaultClientOption(): ClientOption {
  return {
    endpoint: DEFAULT_ENDPOINT,
    chainId: DEFAULT_CHAIN_ID,
    defaultCyclesPrice: '0xffff',
    defaultCyclesLimit: '0xffff',
    maxTimeout: 60000,
    timeoutGap: DEFAULT_TIMEOUT_GAP,
    consensusInterval: DEFAULT_CONSENSUS_INTERVAL,
  };
}
