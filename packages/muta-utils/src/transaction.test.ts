import { Transaction } from '@mutadev/types';
import { addressFromPublicKey, privateKeyToPublicKey } from './account';
import { toBuffer, toHex } from './bytes';
import {
  createTransactionSignature,
  decodeEncryption,
  decodeTransaction,
  encodeTransaction,
  signTransaction,
  verifyTransaction,
} from './transaction';

const tx: Transaction = {
  serviceName: 'service_name',
  sender: 'muta1qqqqqqqqqqqqqqqqqqqqryjpvp',
  payload: '',
  nonce: '0x0000000000000000000000000000000000000000000000000000000000000000',
  method: 'method',
  cyclesPrice: '0xffff',
  cyclesLimit: '0xffff',
  chainId: '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
  timeout: '0x00',
};

const pk1 = Buffer.from(
  '0000000000000000000000000000000000000000000000000000000000000001',
  'hex',
);
const address1 = addressFromPublicKey(privateKeyToPublicKey(pk1));

const pk2 = Buffer.from(
  '0000000000000000000000000000000000000000000000000000000000000002',
  'hex',
);
const address2 = addressFromPublicKey(privateKeyToPublicKey(pk2));

test('encode and decode transaction', () => {
  expect(decodeTransaction(encodeTransaction(tx))).toEqual(tx);
});

test('verify single transaction', () => {
  const encryption = createTransactionSignature(tx, pk1);

  const signatureBuf = toBuffer(encryption.signature);
  expect(verifyTransaction(signatureBuf, tx)).toBe(true);
  expect(verifyTransaction(signatureBuf, tx, address1)).toBe(true);

  // wrong address should be fail when verify
  expect(verifyTransaction(signatureBuf, tx, address2)).toBe(false);
});

test('test verify multi transaction', () => {
  const signed1 = signTransaction(tx, pk1);
  const signed2 = signTransaction(signed1, pk2);

  const result = verifyTransaction(toBuffer(signed2.signature), tx, [
    address1,
    address2,
  ]);

  expect(result).toBe(true);
});

test('decode transaction encryption', () => {
  const decoded = decodeEncryption({
    pubkey:
      '0xe2a10245c12e97900ff554f992225a24db6b678ee5e1a4e94da40691f0495d5757398f',
    signature:
      '0xf842b840c7d902a89a2b6c93be42c1ea1d2ece4a57efcf29297b485dd8c5413d76c50ec94800a34b1dc5bb966819959b086ad088292f44910088214cd1d4a33672971cc3',
  });

  expect(decoded).toEqual({
    signatures: [
      toBuffer(
        '0xc7d902a89a2b6c93be42c1ea1d2ece4a57efcf29297b485dd8c5413d76c50ec94800a34b1dc5bb966819959b086ad088292f44910088214cd1d4a33672971cc3',
      ),
    ],
    pubkeys: [
      toBuffer(
        '0x0245c12e97900ff554f992225a24db6b678ee5e1a4e94da40691f0495d5757398f',
      ),
    ],
  });
});

test('decode transaction encryption via customize transformer', () => {
  const decoded = decodeEncryption(
    {
      pubkey:
        '0xe2a10245c12e97900ff554f992225a24db6b678ee5e1a4e94da40691f0495d5757398f',
      signature:
        '0xf842b840c7d902a89a2b6c93be42c1ea1d2ece4a57efcf29297b485dd8c5413d76c50ec94800a34b1dc5bb966819959b086ad088292f44910088214cd1d4a33672971cc3',
    },
    toHex,
  );

  expect(decoded).toEqual({
    signatures: [
      '0xc7d902a89a2b6c93be42c1ea1d2ece4a57efcf29297b485dd8c5413d76c50ec94800a34b1dc5bb966819959b086ad088292f44910088214cd1d4a33672971cc3',
    ],
    pubkeys: [
      '0x0245c12e97900ff554f992225a24db6b678ee5e1a4e94da40691f0495d5757398f',
    ],
  });
});
