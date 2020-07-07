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

- [@mutadev/muta-sdk](./packages/muta-sdk) - All-in-one SDK for Muta framework
- [@mutadev/client](./packages/muta-client) - Wrapping the GraphQL like RPC
- [@mutadev/client-raw](./packages/muta-client-raw) - Wrapping the raw Muta GraphQL
- [@mutadev/account](./packages/muta-account) - Account system for Muta
- [@mutadev/service](./packages/muta-service) - Wrapping for Muta service
- [@mutadev/utils](./packages/muta-utils) - Commons utils
- [@mutadev/wallet](./packages/muta-wallet) - An simple HD wallet implement
- [@mutadev/defaults](./packages/muta-defaults) - Defaults constants
- [@mutadev/types](./packages/muta-types) - The TypeScript definitions
- [@mutadev/shared](./packages/shared) - Shred third-party dependencies

## Links

- [Documentation](docs)
- [Examples](examples)
- [API](https://nervosnetwork.github.io/muta-sdk-js)
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
