# @mutadev/service

This module privide a serial tools for creating bindings for [Muta service](https://github.com/nervosnetwork/muta-docs/blob/master/service_dev.md).

## Intro Muta Service in 3 Minute

Muta is a Blockchain framework, and the **services** is a layer for customizing business. There are 3 important concept for **service**

- **namespace**: we can define many services in a system,  and each service owns its state, for example, `AssetService` for minting tokens, `DexService` for exchanging tokens).
- **read**: we can define many **read** methods in a **service** to get its state
- **write**: we can define many **write** method to mutate its state. Unlike **read**, a successful state change must be consensus, so we need to wait for the receipt 

## A Quick Glance

The [AssetService](https://github.com/nervosnetwork/muta/blob/master/built-in-services/asset/src/lib.rs) is a builtin-service in the Muta, this module also offered an  [AssetService.ts](./src/builtins/AssetService.ts)