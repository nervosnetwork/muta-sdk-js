# Muta SDK(WIP)

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework). Allow you interact with Muta node's GraphQL service.

## Quick Start

```shell
npm install muta-sdk@next
```

## Example

Suppose the [AssetService](https://github.com/nervosnetwork/muta/blob/master/built-in-services/asset/src/lib.rs) is in use, the bellow code shows how to create UDT(user define token) and how to transfer

1. create an UDT call BTC
2. check the balance
3. transfer to another account
4. check the balance again

```js
const { Muta, utils, AssetService } = require("muta-sdk");

const muta = new Muta({
  endpoint: "http://127.0.0.1:8000/graphql",
  chainId: "0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036"
});

const client = muta.client;
const account = muta.accountFromPrivateKey("0x10000000000000000000000000000000000000000000000000000000000000000");

const service = new AssetService(client, account);

async function main() {
  const supply = 22000000;
  /* create an UDT call BTC */
  const txHash = await service.createAsset({
    name: "BitCoin",
    supply,
    symbol: "BTC"
  });
  const receipt = await client.getReceipt(utils.toHex(txHash));
  const createdAsset = JSON.parse(receipt);
  console.log(utils.toHex(createdAsset.owner) === utils.toHex(account.address));

  /* check the balance */
  const assetId = createdAsset.id;
  const balance = await service.getBalance(assetId, account.address);
  console.log(balance === supply);

  /* transfer to another account */
  const to = "0x2000000000000000000000000000000000000000";
  const transferHash = await service.transfer({
    asset_id: assetId,
    to,
    value: 500
  });
  await client.getReceipt(transferHash);

  /* check the balance again */
  const balance2 = await service.getBalance(assetId, to);
  console.log(balance2 === 500);
}
main();

```

## Links

- [API Documentation](https://nervosnetwork.github.io/muta-sdk-js)
- [Muta](https://github.com/nervosnetwork/muta)

## Development

- nodejs >= 10
- typescript >= 3.7
- yarn

```shell
git clone https://github.com/nervosnetwork/muta-sdk-js
cd muta-sdk-js
yarn
yarn start
```
