function envStr(key: string, defaults: string): string {
  return process?.env?.[key] ?? defaults;
}

function envNum(key: string, defaults: number): number {
  return Number(process?.env?.[key] ?? defaults);
}

/**
 * The default TIMEOUT_GAP. Lookup for `MUTA_TIMEOUT_GAP` in env or defaults to 20
 */
export const DEFAULT_TIMEOUT_GAP = envNum('MUTA_TIMEOUT_GAP', 20);

/**
 * The default chain id. Lookup for `MUTA_CHAIN_ID` in env or
 * defaults to `0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036`
 */
export const DEFAULT_CHAIN_ID = envStr(
  'MUTA_CHAIN_ID',
  '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036'
);

/**
 * Interval(in ms) of consensus engine executed each block. Look up for `MUTA_CONSENSUS_INTERVAL` in env or
 * defaults to _3000_
 */
export const DEFAULT_CONSENSUS_INTERVAL = envNum(
  'MUTA_CONSENSUS_INTERVAL',
  3000
);

/**
 * The Muta project is now in the early stage,
 * so the default endpoint will use localhost.
 * This value will likely change after test network mounted.
 * Lookup for `MUTA_ENDPOINT` in env or defaults to `http://127.0.0.1:8000/graphql`
 */
export const DEFAULT_ENDPOINT = envStr(
  'MUTA_ENDPOINT',
  'http://127.0.0.1:8000/graphql'
);

/**
 *
 */
export const DEFAULT_PRIVATE_KEY = envStr(
  'MUTA_PRIVATE_KEY',
  '0x0000000000000000000000000000000000000000000000000000000000000001'
);
