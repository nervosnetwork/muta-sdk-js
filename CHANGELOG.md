# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0-alpha.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.7...v0.8.0-alpha.0) (2020-03-13)

### Features

- supported `precision` for `AssetService` ([cb70a33](https://github.com/nervosnetwork/muta-sdk-js/commit/cb70a33))

## [0.7.0-alpha.7](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.6...v0.7.0-alpha.7) (2020-03-10)

### Tests

- update test case ([26ec789](https://github.com/nervosnetwork/muta-sdk-js/commit/26ec789))

## [0.7.0-alpha.6](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.5...v0.7.0-alpha.6) (2020-02-27)

### Features

- supported `blockHash` in block ([20d2209](https://github.com/nervosnetwork/muta-sdk-js/commit/20d2209))

## [0.7.0-alpha.5](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.4...v0.7.0-alpha.5) (2020-02-24)

### Features

- changed the default config of Retry ([17d8a81](https://github.com/nervosnetwork/muta-sdk-js/commit/17d8a81))
- defaults client `maxTimeout` to `timeoutGap * consensusInterval` ([60ca55b](https://github.com/nervosnetwork/muta-sdk-js/commit/60ca55b))
- make `timeoutGap` and `consensusInterval` configurable ([ee3d8e0](https://github.com/nervosnetwork/muta-sdk-js/commit/ee3d8e0))
- supported default `endpoint` and `chainId` ([039dfd9](https://github.com/nervosnetwork/muta-sdk-js/commit/039dfd9))

## [0.7.0-alpha.4](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.3...v0.7.0-alpha.4) (2020-02-22)

## [0.7.0-alpha.3](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.2...v0.7.0-alpha.3) (2020-02-22)

### Features

- defaults TIMEOUT_GAP when new a Muta instance ([70d041c](https://github.com/nervosnetwork/muta-sdk-js/commit/70d041c))
- supported read-only service by constructing a service without the account ([c768563](https://github.com/nervosnetwork/muta-sdk-js/commit/c768563))
- switch random-bytes to randomBytes ([e5ac215](https://github.com/nervosnetwork/muta-sdk-js/commit/e5ac215))

## [0.7.0-alpha.2](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.1...v0.7.0-alpha.2) (2020-02-14)

### Features

- create AssetService in binding way ([81d9663](https://github.com/nervosnetwork/muta-sdk-js/commit/81d9663))
- supported binding u64 payload type ([92d9d1b](https://github.com/nervosnetwork/muta-sdk-js/commit/92d9d1b))
- supported Metadata binding ([a814430](https://github.com/nervosnetwork/muta-sdk-js/commit/a814430))

### Tests

- test with new AssetBinding binding ([b00cdad](https://github.com/nervosnetwork/muta-sdk-js/commit/b00cdad))

## [0.7.0-alpha.1](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.7.0-alpha.0...v0.7.0-alpha.1) (2020-02-11)

### Features

- binding for service for preview ([4dd1ab6](https://github.com/nervosnetwork/muta-sdk-js/commit/4dd1ab6))
- supported create Class binding ([be50f62](https://github.com/nervosnetwork/muta-sdk-js/commit/be50f62))

### Tests

- migrate AssetService to binding ([fc1c42a](https://github.com/nervosnetwork/muta-sdk-js/commit/fc1c42a))
- skip the test since AssetService has breaking change ([6855b76](https://github.com/nervosnetwork/muta-sdk-js/commit/6855b76))

## [0.7.0-alpha.0](https://github.com/nervosnetwork/muta-sdk-js/compare/v0.6.0...v0.7.0-alpha.0) (2020-02-09)

### Features

- add an error handling when RPC error ([37ace70](https://github.com/nervosnetwork/muta-sdk-js/commit/37ace70))
- import BigNumber for number safe ([62d2ac1](https://github.com/nervosnetwork/muta-sdk-js/commit/62d2ac1))
- import BigNumber for number safe ([2e2fac0](https://github.com/nervosnetwork/muta-sdk-js/commit/2e2fac0))
- specify the registry to npm ([c4b073f](https://github.com/nervosnetwork/muta-sdk-js/commit/c4b073f))

### Tests

- test BigNumber with AssetService ([206c926](https://github.com/nervosnetwork/muta-sdk-js/commit/206c926))

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
