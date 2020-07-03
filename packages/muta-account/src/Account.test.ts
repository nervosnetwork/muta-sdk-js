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
    '0xf842b8400eb3e538a77380f83607883fa560c54c218e67d06cfaacd8ce239d7ed998e850607e3454ccc84e10fcc5210575c11996b92788938ec55c4c83284b1efc43b80f',
  );
  expect(txHash).toBe(
    '0x9d48758a181d68e8cc8601344d4903cade637ff9f06692ee89583b16008e7b98',
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
    '0xf842b840648b65f30ed8964730e2374d25981ff4d812cd09c5febeb80bb3e8852a9ac3f517d8689d55cd9d957f9f54ba8ff068d723eb288375c496bac0703a790ab2cf3d',
  );
  expect(txHash).toBe(
    '0x72fd551241f07c1c05ce0fe6f5ebc7aa89ed8e6b7a1c640d8509a4cb4eeff623',
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
    '0xf884b840648b65f30ed8964730e2374d25981ff4d812cd09c5febeb80bb3e8852a9ac3f517d8689d55cd9d957f9f54ba8ff068d723eb288375c496bac0703a790ab2cf3db840bed443554b911cce2ca9337b60b8d1e215a2446ac55c4b2337458d1f4f7b9ee8011d2e27a49da9cd8c7cc310622e36f93d9b121d6da7f8a5d9a3a73d3611f673',
  );
  expect(intactTxHash).toBe(
    '0x72fd551241f07c1c05ce0fe6f5ebc7aa89ed8e6b7a1c640d8509a4cb4eeff623',
  );
});
