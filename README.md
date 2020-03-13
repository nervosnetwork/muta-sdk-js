# Muta SDK(WIP)

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework). Allow you interact with Muta node's GraphQL service.

## Quick Start

```shell
npm install muta-sdk@alpha
```

## Example

Suppose the [AssetService](https://github.com/nervosnetwork/muta/blob/master/built-in-services/asset/src/lib.rs) is stable, the bellow code shows how to create a UDT(user define token) and how to transfer UDTs

1. create a default Muta Instance of Muta chain
2. generate random Mnemonic and use it as HDWallet's seed
3. derive a Account, which contains privateKey, as our account for later use
4. get a client to communicate with Muta chain thru the Node given is step 1
5. use Asset Service to create an Asset called LOVE_COIN
6. send certain asset to another address

```js
async function example() {
  const muta = new Muta();

  // get a client which plays a role to sent GraphQL rpc to the Muta chain, it like you get a web3.eth in Ethereum
  const client = muta.client();

  const account = Muta.accountFromPrivateKey(
    '0x...', // my private key
  );

  // get AssetService with given client and accout
  // the client takes responsibility to send you query/transaction to the Muta chain or node
  // the account is as the default sender of query and the only sender of transaction which you send to Muta chain or node
  const service = new AssetService(client, account);

  // the total supply is 1314, nothing special
  const supply = 1314;

  // create an asset call LOVE_COIN with LUV symbol, supply 1314 loves totally
  const createdAsset = await service.create_asset({
    name: 'LOVE_COIN',
    precision: 0,
    supply,
    symbol: 'LUV',
  });

  // keep the asset id for later use, you should keep it carefully
  const assetId = createdAsset.response.ret.id;

  // get the Asset info back, this should equals to createdAsset above :)
  const asset = await service.get_asset({ id: assetId });

  // we replacing it is Okay, cause they are equal, isn't it?
  t.is(asset.ret.id, assetId);

  // get the balance of our account, should equal 1314
  const balance = await service.get_balance({
    asset_id: assetId,
    user: account.address,
  });
  t.is(balance.ret.balance, 1314);

  // use HDWallet to generate random mnemonic
  const mnemonic = Muta.hdWallet.generateMnemonic();

  // use the mnemonic to build an HDWallet
  const wallet = new Muta.hdWallet(mnemonic);

  // we send 520 LUVs
  const to = wallet.deriveAccount(1).address;

  await service.transfer({
    asset_id: assetId,
    to,
    value: 520,
  });

  const balance0x2000000000000000000000000000000000000000 = await service.get_balance(
    {
      asset_id: assetId,
      user: to,
    },
  );
  t.is(balance0x2000000000000000000000000000000000000000.ret.balance, 520);
}
```

## Create My Service Binding

Before we create our custom binding, learn about what is a [service](https://github.com/nervosnetwork/muta-docs) in Muta.
We'll still use [AssetService](https://github.com/HuobiGroup/huobi-chain/tree/master/services/asset/src) as an [example](src/service/binding/AssetService.ts).

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
