import { Account } from './Account';

it('account address should be correct', () => {
  const account = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );
  expect(account.address).toBe('muta10vjpnc8wp0grfaalyjr5cyj39t9vdcsuzuz7qp');
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
    '0xf842b840377d650b1ba9dc228397172a2c7e255e9d44dcd9a9f93bc98b4257891ac8424842edc3a34a9072c900f1631f6c5dd7de90c000a3a95496dd5c64970919847d96',
  );
  expect(txHash).toBe(
    '0x6eb565e3df1a3f97888ea914577dd38c327198ebcd7bc192c97a02f6dff9530b',
  );
});

it('sign multiple signatures transaction by account should be correct', () => {
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
    sender: account1.address,
  });

  const { pubkey, signature, txHash } = signedTransaction;

  expect(pubkey).toBe(
    '0xe2a10308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
  );
  expect(signature).toBe(
    '0xf842b840377d650b1ba9dc228397172a2c7e255e9d44dcd9a9f93bc98b4257891ac8424842edc3a34a9072c900f1631f6c5dd7de90c000a3a95496dd5c64970919847d96',
  );
  expect(txHash).toBe(
    '0x6eb565e3df1a3f97888ea914577dd38c327198ebcd7bc192c97a02f6dff9530b',
  );

  const multiSignedTransaction = account2.signTransaction(signedTransaction);
  const {
    pubkey: multiPubkeys,
    signature: multiSignatures,
    txHash: intactTxHash,
  } = multiSignedTransaction;

  expect(multiPubkeys).toBe(
    '0xf844a10308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0a103c25f637176220cd9f3a66df315559d8263cf2a23a4ab5ab9a293131da190b632',
  );
  expect(multiSignatures).toBe(
    '0xf884b840377d650b1ba9dc228397172a2c7e255e9d44dcd9a9f93bc98b4257891ac8424842edc3a34a9072c900f1631f6c5dd7de90c000a3a95496dd5c64970919847d96b840d46627f77026d70104829a1f9bd60f85fd0c4ec058ff4b42ecf28ce0d70f3d0d52f4eb284af60d7269fda238a4e40b3257d2ad4f8a761a66419fcb6f4acb2b59',
  );
  expect(intactTxHash).toBe(
    '0x6eb565e3df1a3f97888ea914577dd38c327198ebcd7bc192c97a02f6dff9530b',
  );
});
