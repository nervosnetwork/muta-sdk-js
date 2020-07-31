# @mutadev/muta-sdk

Muta JavaScript SDK.

## Usage

```js
const muta = require('@mutadev/muta-sdk');

muta.setDefaultVariables('MUTA_ENDPOINT', 'http://localhost:8000/graphql');

async function main() {
  const client = new muta.Client();
  const height = await client.getLatestBlockHeight();
  console.log(height);
}

main();
```
