// show how to create an account from a private key

const { Account } = require('@mutadev/muta-sdk');

const PRIVATE_KEY =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

// account init from a private key
// 0x0000000000000000000000000000000000000000000000000000000000000001
const account = new Account(PRIVATE_KEY);

console.log(`private key: [${PRIVATE_KEY}]`);
console.log(`address: [${account.address}]`);
console.log(`public key: [${account.publicKey}]`);

// expose the account for other example
exports.account = account;
