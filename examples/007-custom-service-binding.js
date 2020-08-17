const {
  createServiceClass,
  read,
  write,
  Hash,
  u64,
  Address,
  String,
} = require('@mutadev/service');

const GetAssetPayload = {
  id: Hash,
};

const Asset = {
  id: Hash,
  name: String,
  symbol: String,
  supply: u64,
  issuer: Address,
};

const CreateAssetPayload = {
  name: String,
  symbol: String,
  supply: u64,
};

// recommend using TypeScript to create binding
const AssetService = createServiceClass('asset', {
  get_asset: read(GetAssetPayload, Asset),
  create_asset: write(CreateAssetPayload, Asset),
});

// same with example-006
async function main() {
  const service = new AssetService();

  const tokenName = 'My Token' + Math.random();
  // creating asset requires wait for consensus successful,
  // which takes a few seconds
  console.log('waiting for creating asset');
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
