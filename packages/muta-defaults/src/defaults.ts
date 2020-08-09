function envStr(key: string, defaults: string): string {
  return process?.env?.[key] ?? defaults;
}

function envNum(key: string, defaults: number): number {
  return Number(process?.env?.[key] ?? defaults);
}

interface VariableEntry<Key, Value> {
  get(key: Key): Value;

  set(key: Key, value: Value): void;
}

export type DefaultVariableMap = VariableEntry<'MUTA_TIMEOUT_GAP', number> &
  VariableEntry<'MUTA_CHAIN_ID', string> &
  VariableEntry<'MUTA_CONSENSUS_INTERVAL', number> &
  VariableEntry<'MUTA_ENDPOINT', string> &
  VariableEntry<'MUTA_PRIVATE_KEY', string> &
  VariableEntry<'MUTA_ADDRESS_HRP', string> &
  VariableEntry<'MUTA_GRAPHQL_CALLER', string>;

const DefaultVariables: DefaultVariableMap = new Map();

DefaultVariables.set('MUTA_TIMEOUT_GAP', envNum('MUTA_TIMEOUT_GAP', 20));
DefaultVariables.set(
  'MUTA_CONSENSUS_INTERVAL',
  envNum('MUTA_CONSENSUS_INTERVAL', 3000),
);
DefaultVariables.set(
  'MUTA_ENDPOINT',
  envStr('MUTA_ENDPOINT', 'http://127.0.0.1:8000/graphql'),
);
DefaultVariables.set(
  'MUTA_CHAIN_ID',
  envStr(
    'MUTA_CHAIN_ID',
    '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
  ),
);
DefaultVariables.set('MUTA_PRIVATE_KEY', envStr('MUTA_PRIVATE_KEY', ''));

const MUTA_ADDRESS_HRP = envStr('MUTA_ADDRESS_HRP', 'muta');
DefaultVariables.set('MUTA_ADDRESS_HRP', MUTA_ADDRESS_HRP);

DefaultVariables.set(
  'MUTA_GRAPHQL_CALLER',
  envStr('MUTA_GRAPHQL_CALLER', 'muta1ef58dnhean6ugl7s672ya3tre4h0qgx63nas54'),
);

export { DefaultVariables };
