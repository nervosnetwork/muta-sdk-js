import test from 'ava';
import { HDWallet } from './HDWallet';

test('Test HDWallet', t => {
  t.is(HDWallet.generateMnemonic().split(' ').length, 12);

  const wallet = HDWallet.fromMnemonic('drastic behave exhaust enough tube judge real logic escape critic horror gold');
  const pk0 = wallet.getPrivateKey(0);
  const pk1 = wallet.getPrivateKey(1);

  t.is(pk0.toString('hex'), 'c404e991a36c3f92967f6c1cdcd1167999005c71b53e760b2a77831edd048009');
  t.is(pk1.toString('hex'), '199e50f688f16c18fb784fe487bc06a60bf7d1e43ece2391aab11f978951aea1');

});
