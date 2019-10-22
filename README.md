# Muta SDK

The JS/TS SDK for [Muta](https://github.com/nervosnetwork/muta)

## Quick Start

```
npm install homura/muta-js-sdk
```

## Example

```js
import { Muta } from 'muta-sdk';

const muta = new Muta({
  endpoint:'http://127.0.0.1:8000/graphql',
  chainId: '0x...',
});

// create a HD wallet from mnemonic
// const mnemonic = HDWallet.generateMnemonic();
const mnemonic = '12 mnemonic words to create a HD wallet';
const wallet = muta.hdWalletFromMnemonic('mnemonic');

// get pk from account0
const account = wallet.getPrivateKey(0);
console.log(account.address); // 0x10...

// also we can just create account from a private key
// const accountFromPK = muta.accountFromPrivateKey('0xc404e991a36c3f92967f6c1cdcd1167999005c71b53e760b2a77831edd048009')

/*** transfer asset to another account ***/
const client = muta.client;
// create TransferTransaction object
const tx = await client.createTransferTx({
  carryingAmount: "0x10000",
  carryingAssetId: "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
  receiver: "0x103e9b982b443592ffc3d4c2a484c220fb3e29e2e4",
})
// make a signature
const signedTx = account.signTransferTx(tx);
// and send the transfer
client.sendTransferTransaction(signedTx);


```
