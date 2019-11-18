# Muta SDK(WIP)

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)(a High performance Blockchain framework).
Allow you interact with Muta node's GraphQL service.

## Quick Start

```shell
npm install muta-sdk
```

## Example

The bellow code shows how to create account and how to transfer 

```js
import { Muta } from './src/Muta';

async function example() {
  const muta = new Muta({
    endpoint: 'http://127.0.0.1:8000/graphql',
    chainId:
      '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036'
  });

  // create a HD wallet from mnemonic
  // const mnemonic = HDWallet.generateMnemonic();
  const mnemonic = '12 mnemonic words to create a HD wallet';
  const wallet = muta.hdWalletFromMnemonic(mnemonic);

  // get pk from account0
  const account = wallet.accountByIndex(0);
  console.log(account.address); // 0x10...

  // also we can just create account from a private key
  // const accountFromPK = muta.accountFromPrivateKey('0xc404e991a36c3f92967f6c1cdcd1167999005c71b53e760b2a77831edd048009')

  /*** transfer asset to another account ***/
  const client = muta.client;
  // create TransferTransaction object
  const tx = await client.prepareTransferTransaction({
    carryingAmount: '0x1000',
    carryingAssetId:
      '0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5',
    receiver: '0x103e9b982b443592ffc3d4c2a484c220fb3e29e2e4'
  });

  // create a signature
  const signedTx = account.signTransaction(tx);
  // and send the transfer
  await client.sendTransferTransaction(signedTx);

  /* await for consensus about 3 seconds */
  await new Promise(resolve => setTimeout(resolve, 3000));

  // check balance
  const balance = await client.getBalance(
    account.address,
    '0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5'
  );
  console.log(balance);
}
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
