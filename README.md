# Muta SDK

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework).
Allow you to interact with Muta node's GraphQL service.

## Modules

The repo root which organized via monorepo mode, that composed of the following modules

- [muta-sdk](./packages/muta-sdk) - the all-in-one package to interact with Muta
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
npm install graphql muta-sdk
```

> Note: The `graphql` is peerDependent by @mutajs/client-raw. So we need to install it manually. To avoid multiple `graphql` version conflict error, make sure there was only one `graphql` version in our system. If you are also a library contributor dependent on `graphql` module, you should consider whether to peerDependeies on `graphql`

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

main();
```

## Create Service Binding

Before we create our custom binding, learn about what is a [service](https://github.com/nervosnetwork/muta-docs/blob/master/service_dev.md) in Muta.
We'll still use [AssetService](https://github.com/nervosnetwork/muta/blob/master/built-in-services/asset) as an [example](./packages/muta-service/src/binding/AssetService.ts).

## Links

- [API Documentation](https://nervosnetwork.github.io/muta-sdk-js)
- [Muta](https://github.com/nervosnetwork/muta)

## Development

- nodejs >= 10
- yarn

> To ensure that the test passes, please enable a muta-example chain before the test

```shell
git clone https://github.com/nervosnetwork/muta-sdk-js
cd muta-sdk-js
yarn
yarn test
```

### About Package

All modules are under the `packages` folder which organized with similar structure

> You can also create a muta-sdk-like project based on [the template](https://github.com/homura/typescript-monorepo-template)

```
- package-name
  - src
    - index.ts # export related modules
    - foo.ts # module impl
    - foo.test.ts # unit test for this module
    - foo.e2e.ts # e2e test for this module
  - README.md # some description for this module
  - package.json
  - tsconfig.json
```
