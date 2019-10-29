import test from 'ava';
import { SyncAccount } from './SyncAccount';

test('signature', t => {
  const account = SyncAccount.fromPrivateKey("0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f");

  t.deepEqual(
    account.signTransaction({
      "carryingAmount": "0x01",
      "carryingAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
      "chainId": "0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036",
      "feeAssetId": "0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5",
      "feeCycle": "0xff",
      "nonce": "0x00000000000000000000000000000000bcc53bb0e6b57f561ebf1f0bc65fa8b1",
      "receiver": "0x103e9b982b443592ffc3d4c2a484c220fb3e29e2e4",
      "timeout": "0x22752"
    }),
    {
      "pubkey": "0x031288a6788678c25952eba8693b2f278f66e2187004b64ac09416d07f83f96d5b",
      "signature": "0xf89f73cf4896cabd59a2abf38a7b070c37a4fff88a50001fd93693bf033eb54700156db2ff775cd74789f793abb28d56a2f93e551a4076f003f02bd705041015",
      "txHash": "0x402b883d9f7f25fe8d98bd8549e5741c82f4dddf583f8c9d14874ffe36601af2"
    });
});
