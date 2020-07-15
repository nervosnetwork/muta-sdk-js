# Examples

To run these examples, we should build sdk at first.
Recommend running these examples with VSCode or WebStorm,
they can auto-complete for you when you try your example code.

## Requirement

- [NodeJS 10+](https://nodejs.org/en/download/)
- [yarn 1.20+](https://classic.yarnpkg.com/en/docs/install)
- [Muta example-chain](https://github.com/nervosnetwork/muta/releases)

## Start A muta-example Chain

If you are new to Muta, or just want to try out the SDK,
we recommend using [Docker](https://docs.docker.com/get-docker/)
to avoid compile failures caused by different environments.

```
docker run --rm mutadev/muta
```

## Build The SDK

```
git clone https://github.com/nervosnetwork/muta-sdk-js
cd muta-sdk-js
yarn
yarn build
```

## Run The Example

```
export MUTA_PRIVATE_KEY=0x1000000000000000000000000000000000000000000000000000000000000000
cd examples
node 001-get-some-block-info.js
```
