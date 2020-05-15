# @mutajs/client

## Examples

### Basic

```js
async function getTransaction() {
    const client = new Client();

    const raw = await client.composeTransaction({
      serviceName: 'asset',
      method: 'create_asset',
      payload: {
        name: Math.random().toString(),
        supply: 10000,
        symbol: Math.random().toString(),
      },
    });

    const hash = client.sendTransaction(account.signTransaction(raw));
    const tx = await retry(() => client.getTransaction(hash));
    console.log(tx)
    const receipt = await retry(() =>client.getReceipt(hash));
    console.log(receipt);
} 
```

### Batch

```js

async function batch() {
  const client = new Client();

  const tx1 = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: Math.random().toString(),
      supply: 10000,
      symbol: Math.random().toString(),
    },
  });

  const tx2 = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: Math.random().toString(),
      supply: 10000,
      symbol: Math.random().toString(),
    },
  });

  const hashes = await Promise.all([
    client.sendTransaction(account.signTransaction(tx1)),
    client.sendTransaction(account.signTransaction(tx2)),
  ]);

  const batchClient = new BatchClient();
  const receipts = await retry(() => batchClient.getReceipts(hashes));
  expect(receipts.every(receipt => receipt.txHash)).toBe(true);
}

```
