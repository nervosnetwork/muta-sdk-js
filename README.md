# Muta SDK

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework). Allow you to interact with Muta node's GraphQL service.

## Quick Start

### npm

```shell
npm install graphql@14 @mutadev/muta-sdk
```

### yarn

```shell
yarn add graphql@14 @mutadev/muta-sdk
```

> Note: The `graphql` is peerDependent by @mutadev/client-raw. So we need to install it manually. To avoid multiple `graphql` version conflict error, make sure there was only one `graphql` version in our system. If you are also a library contributor dependent on `graphql` module, you should consider whether to peerDependeies on `graphql`

## Usage

```js
var sdk = require('@mutadev/muta-sdk');

var muta = new sdk.Muta();

// Muta {
//   context: {
//     chainId: '0x...',
//     consensusInterval: 3000,
//     endpoint: 'http://127.0.0.1:8000/graphql',
//     timeoutGap: 20
//   }
// }
console.log(muta);
```

## Modules

The repo root which organized via monorepo mode, that composed of the following modules

- [@mutadev/muta-sdk](./packages/muta-sdk) - the all-in-one package to interact with Muta
- [@mutadev/client](./packages/muta-client) - wrap the GraphQL interface like RPC
- [@mutadev/client-raw](./packages/muta-client-raw) - wrap the raw Muta GraphQL
- [@mutadev/account](./packages/muta-account) - account system for Muta
- [@mutadev/wallet](./packages/muta-wallet) - an HD wallet implement for Muta instance
- [@mutadev/service](./packages/muta-service) - wrap the Muta service
- [@mutadev/utils](./packages/muta-utils) - common utils for Muta
- [@mutadev/defaults](./packages/muta-defaults) - provides some default config
- [@mutadev/types](./packages/muta-types) - provide some typescript type definition
- [@mutadev/shared](./packages/shared) - shared third-party dependencies

## Links

- [API Documentation](https://nervosnetwork.github.io/muta-sdk-js)
- [Examples](./examples)
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
