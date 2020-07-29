import { addressFromPublicKey } from './account';

test('bech32 address should be correct', () => {
  const address = addressFromPublicKey(
    '0x02ee34d1ce8270cd236e9455d4ab9e756c4478779b1a20d7ce1c247af61ec2be3b',
  );

  expect(address).toBe('muta14tk7le96va4shfg7kcd4prhqqxmvgl8c9fp4n2');
});
