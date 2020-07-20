const { Account, Client, retry, utils } = require('@mutadev/muta-sdk');
const { MultiSignatureService, AssetService } = require('@mutadev/service');

const client = new Client();
const account1 = new Account(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
);
const account2 = new Account(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
);
const account3 = new Account(
  '0x0000000000000000000000000000000000000000000000000000000000000003',
);

const multiSigService = new MultiSignatureService(client, account1);
const accountService = new AssetService(client, account1);

async function main() {
  console.log(`creating multi-sig account`);
  const multiSigReceipt = await multiSigService.write.generate_account({
    addr_with_weight: [
      { address: account1.address, weight: 1 },
      { address: account2.address, weight: 1 },
      { address: account3.address, weight: 1 },
    ],
    memo: 'hello world',
    owner: account1.address,
    threshold: 2,
  });

  const multiSigAddress = multiSigReceipt.response.response.succeedData.address;
  console.log(`created an multi-sig account ${multiSigAddress}`);

  const rawTx = await accountService.write.create_asset.composeTransaction({
    name: 'MultiSigToken' + Math.random(),
    supply: 10000000,
    symbol: 'MST',
  });

  rawTx.sender = multiSigAddress;

  const signed1 = account1.signTransaction(rawTx);
  const signed2 = account2.signTransaction(signed1);
  const signed3 = account3.signTransaction(signed2);

  console.log(`creating an asset by the multi-sig account`);
  const txHash = await client.sendTransaction(signed3);

  const receipt = await retry(() => client.getReceipt(txHash));
  const succeedData = receipt.response.response.succeedData;
  const asset = utils.safeParseJSON(succeedData);

  console.log(`created an asset by ${multiSigAddress}`);
  console.log(asset);
}

main();
