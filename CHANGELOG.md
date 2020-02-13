# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.7.0-alpha.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.6.0...v0.7.0-alpha.0) (2020-02-09)

### Features

- add an error handling when RPC error ([37ace70](https://github.com/nervosnetwork/muta-sdk-js/commit/37ace70))
- import BigNumber for number safe ([62d2ac1](https://github.com/nervosnetwork/muta-sdk-js/commit/62d2ac1))
- import BigNumber for number safe ([2e2fac0](https://github.com/nervosnetwork/muta-sdk-js/commit/2e2fac0))
- specify the registry to npm ([c4b073f](https://github.com/nervosnetwork/muta-sdk-js/commit/c4b073f))

### Tests

- test BigNumber with AssetServiceTs ([206c926](https://github.com/nervosnetwork/muta-sdk-js/commit/206c926))

## [0.6.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.5.0...v0.6.0) (2020-02-07)

### Features

- support addressFromPublicKey in utils directly ([0fcecec](https://github.com/nervosnetwork/muta-sdk-js/commit/0fcecec))
- support signTransaction in utils directly ([bf12165](https://github.com/nervosnetwork/muta-sdk-js/commit/bf12165))
- supported exec_height with raw_client ([2540ad9](https://github.com/nervosnetwork/muta-sdk-js/commit/2540ad9))

## [0.5.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.4.0...v0.5.0) (2020-02-01)

### Features

- replace epoch with block to make code more clear ([#1](https://github.com/nervosnetwork/muta-sdk-js/issues/1)) ([472be5c](https://github.com/nervosnetwork/muta-sdk-js/commit/472be5c))

## [0.4.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.3.0...v0.4.0) (2020-01-18)

### Features

- change timeout defaults to INTERVAL \* TIMEOUT_GAP to avoid RetryTimeoutError ([946b2b3](https://github.com/nervosnetwork/muta-sdk-js/commit/946b2b3))
- expose the raw graphql client ([8058649](https://github.com/nervosnetwork/muta-sdk-js/commit/8058649))

## [0.3.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.2.0...v0.3.0) (2020-01-09)

### Features

- supported creating a signature from a transaction ([c63b852](https://github.com/nervosnetwork/muta-sdk-js/commit/c63b852))

### Tests

- update test case ([ac48a65](https://github.com/nervosnetwork/muta-sdk-js/commit/ac48a65))

## [0.2.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.1.0...v0.2.0) (2020-01-06)

## 0.1.0 (2019-11-19)

### Bug Fixes

- **client:** fix GraphQL query cache, disable cache now ([d281380](https://github.com/nervosnetwork/muta-sdk-js/commit/d281380))

### Features

- **account:** support SyncAccount to make signature from private key ([d09459f](https://github.com/nervosnetwork/muta-sdk-js/commit/d09459f))
- **chore:** update homepage ([1490b96](https://github.com/nervosnetwork/muta-sdk-js/commit/1490b96))
- **client:** client now support transfer transaction ([390ecf8](https://github.com/nervosnetwork/muta-sdk-js/commit/390ecf8))
- **Client:** support getBalance ([465d8d3](https://github.com/nervosnetwork/muta-sdk-js/commit/465d8d3))
- **core:** change default timeout_gap to 20 to sync with Muta config ([b8f6884](https://github.com/nervosnetwork/muta-sdk-js/commit/b8f6884))
- **core:** change the RLP serialization order to fit to fixed_codec(nervosnetwork/muta[#25](https://github.com/nervosnetwork/muta-sdk-js/issues/25)) ([0e7f5e8](https://github.com/nervosnetwork/muta-sdk-js/commit/0e7f5e8))
- **doc:** sync Muta for new modules ([6604522](https://github.com/nervosnetwork/muta-sdk-js/commit/6604522))
- **muta:** sync Muta for new modules ([3676eb8](https://github.com/nervosnetwork/muta-sdk-js/commit/3676eb8))
- **utils:** support transform buffer and hex ([30c18a5](https://github.com/nervosnetwork/muta-sdk-js/commit/30c18a5))
- **wallet:** support export private key by account index from the HDWallet ([465ab66](https://github.com/nervosnetwork/muta-sdk-js/commit/465ab66))

### Tests

- update test case to fit to fixed_codec(nervosnetwork/muta[#25](https://github.com/nervosnetwork/muta-sdk-js/issues/25)) ([603eaab](https://github.com/nervosnetwork/muta-sdk-js/commit/603eaab))
