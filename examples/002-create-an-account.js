// show how to create an account from a private key

const { Account } = require('../packages/muta-account');

const PRIVATE_KEY =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

const account = new Account(PRIVATE_KEY);

console.log('I have created an account from a private key, and');
console.log('the address is: ' + account.address);
console.log('the public key is: ' + account.publicKey);

// expose the account for other example
module.exports = account;
