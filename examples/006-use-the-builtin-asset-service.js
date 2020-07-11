// we can use the ServiceBinding to avoid so much template code
// if the service already provides binding

const { AssetService } = require('@mutadev/service');

async function main() {
  // const service = new AssetService(new Client(...), new Account(...));
  const service = new AssetService();

  const tokenName = 'My Token' + Math.random();
  // creating asset requires wait for consensus successful,
  // which takes a few seconds
  const createdAsset = await service.write.create_asset({
    name: tokenName,
    supply: 10000,
    symbol: 'MT',
  });
  const assetId = createdAsset.response.response.succeedData.id;
  console.log(`create asset id is: [${assetId}]`);

  // after successfully creating an asset,
  // we can find it on Muta
  const asset = await service.read.get_asset({ id: assetId });
  console.log(`found [${asset.succeedData.name}] was created on Muta`);
}

main();
