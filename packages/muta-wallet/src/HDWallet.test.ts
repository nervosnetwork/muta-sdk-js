import { HDWallet } from './HDWallet';

it('Test HDWallet', () => {
  expect(HDWallet.generateMnemonic().split(' ').length).toBe(12);

  const wallet = new HDWallet(
    'drastic behave exhaust enough tube judge real logic escape critic horror gold',
  );
  const pk0 = wallet.derivePrivateKey(0);
  const pk1 = wallet.derivePrivateKey(1);

  expect(pk0.toString('hex')).toBe(
    '8ceac4c591bfb13c6cc4b211f83df53f1edd54a88970f1ee88eeda8d07c0e161',
  );
  expect(pk1.toString('hex')).toBe(
    '7dab2ed67c2dd811139b2bb257cd998f38dc5b05c7377a143e143e45708e34c8',
  );
});
