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
    sender: account.address,
  });

  const { pubkey, signature, txHash } = signedTransaction;

  expect(pubkey).toBe(
    '0xe2a10308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
  );
  expect(signature).toBe(
    '0xf842b840b721ee855d8ea10ad8d867f8562649778524eb1c498fc3303d017567dbfb1a686da686290e9518f3297e61288f1b40d08cedba80e798bca69603928d9d569c5d',
  );
  expect(txHash).toBe(
    '0xff895921375aaab1d82c702c1a409500799e2750851610dc03a081b77f0f949b',
  );
});

it('sign multiple signatures transaction by account should be correct', () => {
  const multiSigsAddress = '0x0000000000000000000000000000000000000001';
  const account1 = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );
  const account2 = Account.fromPrivateKey(
    '0x2000000000000000000000000000000000000000000000000000000000000000',
  );

  const signedTransaction = account1.signTransaction({
    chainId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    cyclesLimit: '0x00',
    cyclesPrice: '0x00',
    method: 'method',
    nonce: '0x0000000000000000000000000000000000000000000000000000000000000000',
    payload: 'payload',
    serviceName: 'service_name',
    timeout: '0x9999',
    sender: multiSigsAddress,
  });

  const { pubkey, signature, txHash } = signedTransaction;

  expect(pubkey).toBe(
    '0xe2a10308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
  );
  expect(signature).toBe(
    '0xf842b840e1cc7674e11ea27fbb41d2678478dbb68b2514712c9b7e95f9b8da784a8d07bc327621858967fb2d8cd55e649cae092df9f2836b8a40040cb56b8471854d7c54',
  );
  expect(txHash).toBe(
    '0xa6d5c4ed2e9a5d6847b8f20944b10ba762fa00417118d8f4d9f6d5c61db76ad2',
  );

  const multiSignedTransaction = account2.signMultiSigTransaction(signedTransaction);
  const { pubkey: multiPubkeys, signature: multiSignatures, txHash: intactTxHash } = multiSignedTransaction;

  expect(multiPubkeys).toBe(
    '0xf844a10308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0a103c25f637176220cd9f3a66df315559d8263cf2a23a4ab5ab9a293131da190b632',
  );
  expect(multiSignatures).toBe(
    '0xf884b840e1cc7674e11ea27fbb41d2678478dbb68b2514712c9b7e95f9b8da784a8d07bc327621858967fb2d8cd55e649cae092df9f2836b8a40040cb56b8471854d7c54b8407a3d82c949bc4f76fe9eb57026e0885982c536bdfbb076574b05a66476b9157a3b1b479a4b297f92d07ec9604beec743b7c49112d77d908f6d22949836fa8f00',
  );
  expect(intactTxHash).toBe(
    '0xa6d5c4ed2e9a5d6847b8f20944b10ba762fa00417118d8f4d9f6d5c61db76ad2',
  );
});
