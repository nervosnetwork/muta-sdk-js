import { Account } from '../src/account';

/**
 * let us start a simple example to understand Account class
 *
 * well, Account is a quite easy understanding class. It represent an account on
 * Muta chain. Like most block chains, Muta also use address as the unique identifier
 * on Muta chain.
 *
 * Account contains not only the address, but also the private keys which derives
 * the public key and address.
 */
(async function AccountExample() {
  /**
   * since we got an Account from HDwallet by derive the path, now we show how
   * to give a private key directly to create an account
   */

  const account = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );

  /**
   * good, now you can get the derived public key and address
   */

  const publicKey = account.publicKey;
  const address = account.address;

  /**
   * the Account has another function ,which is to Sign a transaction, we wil introduce this later
   *
   * since you've got all what basic information, we go on to Client
   */
})();
