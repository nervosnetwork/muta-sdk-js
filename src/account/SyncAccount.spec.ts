import test from 'ava';
import { SyncAccount } from './SyncAccount';

test('signature', t => {
  const account = SyncAccount.fromPrivateKey("0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f");

  t.deepEqual(
    account.signTransaction({
      "carryingAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
      "chainId": "0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036",
      "feeAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
      "feeCycle": "0xff",
      "receiver": "0x103e9b982b443592ffc3d4c2a484c220fb3e29e2e4",
      "nonce": "0x00000000000000000000000000000000bcc53bb0e6b57f561ebf1f0bc65fa8b1",
      "timeout": "0x22752",
      "carryingAmount": "0x01"
    }),
    {
      "txHash": "0x2cb89cbdd613f7af728a095e3949d38de45e4fd56ce5618a076bd40becd5f9de",
      "pubkey": "0x031288a6788678c25952eba8693b2f278f66e2187004b64ac09416d07f83f96d5b",
      "signature": "0xd1dc56336facdcbff3caeec4f5c179f50709aa16f1f981d00b0cad543c14e9e631392b974c52b1f4478730f3f0c501b81d302eb2665d8d8b11297466d2aa8bac"
    });
});
