import { Account } from './Account';

it('account address should be correct', () => {
  const account = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );
  expect(account.address).toBe('0xd17b9e27ef454ce597f3f05a5b5d4dcc96a423f9');
});

it('sign by account should be correct', () => {
  const account = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );

  const signedTransaction = account.signTransaction({
    chainId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    cyclesLimit: '0x00',
    cyclesPrice: '0x00',
    method: 'method',
    nonce: '0x0000000000000000000000000000000000000000000000000000000000000000',
    payload: 'payload',
    serviceName: 'service_name',
    timeout: '0x9999',
  });

  const { pubkey, signature, txHash } = signedTransaction;

  expect(pubkey).toBe(
    '0x0308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
  );
  expect(signature).toBe(
    '0xb911f4c58d9ae2c8ea4a546c426f4167813dd0d7a8b5de7f2a7d40e07d7df4572b5670744954ea1f2ff831d5c579fa5d937beb0ddd544d18f8bc069547ac5295',
  );
  expect(txHash).toBe(
    '0x26e4ec1c25cc0c6fc084f358b97a7615fee1b229d271ba40bcfc5be80b6dd0d4',
  );
});
