# @mutadev/account

Account system for [Muta framework](https://github.com/nervosnetwork/muta),

## Signature

```js
const Account = require('@mutadev/account');

const account = new Account('0x...');
account.signTransaction({
    service: '...',
    method: '...',
    payload: '{...}',
    sender: '0x...'
})
```

## Multi-signature

```js
const Account = require('@mutadev/account');

const account = new Account('0x...');
// a signed transaction from another account
const signedTransaction = {};

account.signTransaction(signedTransaction)
```
