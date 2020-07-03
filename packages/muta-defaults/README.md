# @mutadev/defaults

Provide the default configuration or read configuration from environment variables for SDK instance

## Environment Variables

### MUTA_ENDPOINT

The Muta GraphQL endpoint

- type: string
- default: http://127.0.0.1:8000/graphql

### MUTA_CHAIN_ID

A hex formated string for chain_id

- type: string
- default: 0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036

### MUTA_CONSENSUS_INTERVAL

Interval (in ms) of consensus engine executed each block.

- type: number
- default: 3000

### MUTA_TIMEOUT_GAP

A number for max available unprocessed block height gap

- type: number
- default: 20
