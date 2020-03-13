import test from 'ava';
import { Muta } from './Muta';
import { AssetService } from './service';

test('Muta example', async t => {
  const muta = Muta.createDefaultMutaInstance();

  // get a client which plays a role to sent GraphQL rpc to the Muta chain, it like you get a web3.eth in Ethereum
  const client = muta.client();

  // derive an account from the HDWallet
  const account = Muta.accountFromPrivateKey(
    '0x2b672bb959fa7a852d7259b129b65aee9c83b39f427d6f7bded1f58c4c9310c2',
  );

  // get AssetService with given client and accout
  // the client takes responsibility to send you query/transaction to the Muta chain or node
  // the account is as the default sender of query and the only sender of transaction which you send to Muta chain or node
  const service = new AssetService(client, account);

  // the total supply is 1314, nothing special
  const supply = 1314;

  // create an asset call LOVE_COIN with LUV symbol, supply 1314 loves totally
  const createdAsset = await service.create_asset({
    name: 'LOVE_COIN' + Math.random(),
    precision: 0,
    supply,
    symbol: 'LUV',
  });

  // keep the asset id for later use, you should keep it carefully
  const assetId = createdAsset.response.ret.id;

  // get the Asset info back, this should equals to createdAsset above :)
  const asset = await service.get_asset({ id: assetId });

  // we replacing it is Okay, cause they are equal, isn't it?
  t.is(asset.ret.id, assetId);

  // get the balance of our account, should equal 1314
  const balance = await service.get_balance({
    asset_id: assetId,
    user: account.address,
  });
  t.is(balance.ret.balance, 1314);

  // use HDWallet to generate random mnemonic
  const mnemonic = Muta.hdWallet.generateMnemonic();

  // use the mnemonic to build an HDWallet
  const wallet = new Muta.hdWallet(mnemonic);

  // we send 520 LUVs
  const to = wallet.deriveAccount(2).address;

  await service.transfer({
    asset_id: assetId,
    to,
    value: 520,
  });

  const balance0x2000000000000000000000000000000000000000 = await service.get_balance(
    {
      asset_id: assetId,
      user: to,
    },
  );
  t.is(balance0x2000000000000000000000000000000000000000.ret.balance, 520);
});
