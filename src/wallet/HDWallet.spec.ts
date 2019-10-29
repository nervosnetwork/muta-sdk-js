import test from 'ava';
import { HDWallet } from './HDWallet';

test('Test HDWallet', t => {
  t.is(HDWallet.generateMnemonic().split(' ').length, 12);

  const wallet = HDWallet.fromMnemonic('drastic behave exhaust enough tube judge real logic escape critic horror gold');
  const pk0 = wallet.getPrivateKey(0);
  const pk1 = wallet.getPrivateKey(1);

  t.is(pk0.toString('hex'), 'a5f1719b96e51c5d12d2fbe8cd4d38bd18d5e2d2921e34f3e974e570502c3d29');
  t.is(pk1.toString('hex'), '9b1f64494f326b40a3e3267b6310b9cb8fd68b093d0547762b981e5e718f2542');

});
