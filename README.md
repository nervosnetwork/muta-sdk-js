# Muta SDK

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework). 
Allow you to interact with Muta node's GraphQL service.

## Modules

This is a root organized into monorepo mode, which is composed of the following modules

- [muta-sdk](./packages/muta-sdk) - the all-in-one packages to interact with Muta
- [@mutajs/client](./packages/muta-client) - wrap the GraphQL interface like RPC
- [@mutajs/client-raw](./packages/muta-client-raw) - wrap the raw Muta GraphQL
- [@mutajs/account](./packages/muta-account) - account system for Muta
- [@mutajs/wallet](./packages/muta-wallet) - an HD wallet implement for Muta instance
- [@mutajs/service](./packages/muta-service) - wrap the Muta service
- [@mutajs/utils](./packages/muta-utils) - common utils for Muta
- [@mutajs/defaults](./packages/muta-defaults) - provides some default config
- [@mutajs/types](./packages/muta-types) - provide some typescript type definition 
- [@mutajs/shared](./packages/shared) - shared third-party dependencies

## Quick Start

```shell
npm install muta-sdk
```

## Example

The following code will show

1. How to interact with `#[read]` service
2. How to sign a transaction
3. How to sendTransaction

```ts
import { Muta } from 'muta-sdk';

async function main() {
  const muta = new Muta();
  const client = muta.client();
  // get metadata from the chain
  const metadataResponse = await client.queryServiceDyn({
    method: 'get_metadata',
    payload: '',
    serviceName: 'metadata',
  });

  console.log(metadataResponse);

  // Accounts with permission to modify metadata
  const admin = Muta.accountFromPrivateKey('0x...');

  // Preparing transaction
  const tx = await client.composeTransaction({
    method: 'update_metadata',
    payload: {
      // ...
    },
    serviceName: 'metadata',
  });
  const signedTx = admin.signTransaction(tx);
  const txHash = await client.sendTransaction(signedTx);
  const receipt = await client.getReceipt(txHash);

  console.log(receipt);
}
```

## Create Service Binding

Before we create our custom binding, learn about what is a [service](https://github.com/nervosnetwork/muta-docs/blob/master/service_dev.md) in Muta.
We'll still use [AssetService](https://github.com/nervosnetwork/muta/blob/master/built-in-services/asset) as an [example](./packages/muta-service/src/binding/AssetService.ts).

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
