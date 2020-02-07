import test from 'ava';
import { AssetService } from './builtin';
import { Muta } from './Muta';

test('Muta example', async t => {
  const muta = Muta.createDefaultMutaInstance();

  // get a client which plays a role to sent GraphQL rpc to the Muta chain, it like you get a web3.eth in Ethereum
  const client = muta.client();

  // use HDWallet to generate random mnemonic
  const mnemonic = Muta.hdWallet.generateMnemonic();

  // use the mnemonic to build an HDWallet
  const wallet = new Muta.hdWallet(mnemonic);

  // derive an account from the HDWallet
  const account = wallet.deriveAccount(1);

  // get AssetService with given client and accout
  // the client takes responsibility to send you query/transaction to the Muta chain or node
  // the account is as the default sender of query and the only sender of transaction which you send to Muta chain or node
  const service = new AssetService(client, account);

  // the total supply is 1314, nothing special
  const supply = 1314;

  // create an asset call LOVE_COIN with LUV symbol, supply 1314 loves totally
  const createdAsset = await service.createAsset({
    name: 'LOVE_COIN',
    supply,
    symbol: 'LUV'
  });

  // keep the asset id for later use, you should keep it carefully
  const assetId = createdAsset.asset_id;

  // get the Asset info back, this should equals to createdAsset above :)
  const asset = await service.getAsset(assetId);

  // we replacing it is Okay, cause they are equal, isn't it?
  t.is(asset.asset_id, assetId);

  // get the balance of our account, should equal 1314
  const balance = await service.getBalance(assetId, account.address);
  t.is(balance, 1314);

  // we send 520 LUVs
  const to = '0x2000000000000000000000000000000000000000';

  await service.transfer({
    asset_id: assetId,
    to,
    value: 520
  });

  const balance0x2000000000000000000000000000000000000000 = await service.getBalance(
    assetId,
    to
  );
  t.is(balance0x2000000000000000000000000000000000000000, 520);
});
