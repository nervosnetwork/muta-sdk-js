import test from 'ava';
import { signTransaction } from './';

test('sign', async t => {
  const signedTransaction = signTransaction(
    {
      chainId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      cyclesLimit: '0x00',
      cyclesPrice: '0x00',
      method: 'method',
      nonce:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      payload: 'payload',
      serviceName: 'service_name',
      timeout: '0x9999'
    },
    Buffer.from(
      '10000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
  );

  const { pubkey, signature, txHash } = signedTransaction.inputEncryption;
  t.is(
    pubkey,
    '0x0308ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0'
  );
  t.is(
    signature,
    '0xb911f4c58d9ae2c8ea4a546c426f4167813dd0d7a8b5de7f2a7d40e07d7df4572b5670744954ea1f2ff831d5c579fa5d937beb0ddd544d18f8bc069547ac5295'
  );
  t.is(
    txHash,
    '0x26e4ec1c25cc0c6fc084f358b97a7615fee1b229d271ba40bcfc5be80b6dd0d4'
  );
});
