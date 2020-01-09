/**
 * Muta has no native token(coin), but the _coin_type_ is required  by HD Wallet
 */
export const COIN_TYPE = 2;

/**
 * There is a timeout gap in Muta chain, by default,
 * Muta only process request a period of time according to the epoch height
 */
export const DEFAULT_TIMEOUT_GAP = 20;

/**
 * Interval of consensus engine executed each block
 */
export const DEFAULT_CONSENSUS_INTERVAL = 3000;
