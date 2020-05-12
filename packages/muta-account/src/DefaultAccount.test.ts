import { Witness } from '@mutajs/types';
import { DefaultAccount } from './DefaultAccount';

it('account address should be correct', () => {
  const account = DefaultAccount.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  );
  expect(account.address).toBe('0xd17b9e27ef454ce597f3f05a5b5d4dcc96a423f9');
});

test('sign by account should be correct', () => {
  const account = DefaultAccount.fromPrivateKey(
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

  const { txHash, witness: serializedWitness } = signedTransaction;

  const witness: Witness = JSON.parse(serializedWitness);
  const { pubkeys, signatures, signatureType } = witness;

  expect(signatureType).toBe(0);

  expect(pubkeys[0]).toBe(
    '0x0308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
  );
  expect(signatures[0]).toBe(
    '0x1c1fcbd96d675e558d586c4dcbb354f842f8142ec570af7151ac88b15aaebf19774884d700bc481d519508f5e13f98419515f636abc0df3fdce6985707d18d92',
  );
  expect(txHash).toBe(
    '0xf0ead191bc8a33ee6e22a8c48d138020a6c0f0be7fb6f3b6d6d179ef0839d47f',
  );
});
