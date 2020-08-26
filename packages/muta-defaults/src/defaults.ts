function envStr(key: string, defaults: string): string {
  return process?.env?.[key] ?? defaults;
}

function envNum(key: string, defaults: number): number {
  return Number(process?.env?.[key] ?? defaults);
}

// prettier-ignore
const defaultVariables = {
  MUTA_TIMEOUT_GAP: 20,
  MUTA_CONSENSUS_INTERVAL: 3000,
  MUTA_ENDPOINT: 'http://127.0.0.1:8000/graphql',
  MUTA_CHAIN_ID: '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
  MUTA_PRIVATE_KEY: '',
  MUTA_ADDRESS_HRP: 'muta',
  MUTA_GRAPHQL_CALLER: 'muta1ef58dnhean6ugl7s672ya3tre4h0qgx63nas54',
};

export type DefaultVariableMap<Builtins = typeof defaultVariables> = {
  set<K extends keyof Builtins>(k: K, v: Builtins[K]): void;
  get<K extends keyof Builtins>(key: K): Builtins[K];
} & {
  set(k: string, v: unknown): void;
  get(key: string): unknown;
};

function builtinVariables<Builtins>(
  variables: Builtins,
): DefaultVariableMap<Builtins> {
  const entries = Object.entries(variables).map<[string, unknown]>(
    ([key, defaultValue]) => [
      key,
      typeof defaultValue === 'number'
        ? envNum(key, defaultValue)
        : envStr(key, defaultValue),
    ],
  );
  return new Map(entries) as DefaultVariableMap<Builtins>;
}

export const DefaultVariables = builtinVariables(defaultVariables);
