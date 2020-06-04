function envStr(key: string, defaults: string): string {
  return process?.env?.[key] ?? defaults;
}

function envNum(key: string, defaults: number): number {
  return Number(process?.env?.[key] ?? defaults);
}

/**
 * the default TIMEOUT_GAP
 */
export const DEFAULT_TIMEOUT_GAP = envNum('MUTA_TIMEOUT_GAP', 20);

/**
 * The default chain id
 */
export const DEFAULT_CHAIN_ID = envStr(
  'MUTA_CHAIN_ID',
  '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
);

/**
 * Interval of consensus engine executed each block
 */
export const DEFAULT_CONSENSUS_INTERVAL = envNum(
  'MUTA_CONSENSUS_INTERVAL',
  3000,
);

/**
 * The Muta project is now in the early stage,
 * so the default endpoint will use localhost.
 * This value will likely change after test network mounted
 */
export const DEFAULT_ENDPOINT = envStr(
  'MUTA_ENDPOINT',
  'http://127.0.0.1:8000/graphql',
);
