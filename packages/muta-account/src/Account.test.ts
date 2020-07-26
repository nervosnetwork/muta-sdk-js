import { Account } from './Account';

it('account address should be correct', () => {
  const account = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );
  expect(account.address).toBe('muta1ef58dnhean6ugl7s672ya3tre4h0qgx63nas54');
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
    '0xf842b8400bb14b08f2c4ebcde3bb40c49c9667313fe356fdcbc6595117e54669dfdd6c2c1989b5825d77c726f4f6c52974094a7b64617872e17b8d5fa3701550e33a3250',
  );
  expect(txHash).toBe(
    '0x99326ed2129fab2bd992354c86ce5cc3b4a4b31b2e45de4a150748ed623e040c',
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
    '0xf842b8400bb14b08f2c4ebcde3bb40c49c9667313fe356fdcbc6595117e54669dfdd6c2c1989b5825d77c726f4f6c52974094a7b64617872e17b8d5fa3701550e33a3250',
  );
  expect(txHash).toBe(
    '0x99326ed2129fab2bd992354c86ce5cc3b4a4b31b2e45de4a150748ed623e040c',
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
    '0xf884b8400bb14b08f2c4ebcde3bb40c49c9667313fe356fdcbc6595117e54669dfdd6c2c1989b5825d77c726f4f6c52974094a7b64617872e17b8d5fa3701550e33a3250b840812bee86eb5f37c6d4d9fd76fd0a921a48cdaed818e85b480e7c8c37f28ddc2a43086a4b936393ebb822af14fa5bbaead805fab8f0203e15fe1986c29320815f',
  );
  expect(intactTxHash).toBe(
    '0x99326ed2129fab2bd992354c86ce5cc3b4a4b31b2e45de4a150748ed623e040c',
  );
});
