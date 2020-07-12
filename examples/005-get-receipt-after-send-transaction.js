const { Client, retry, Account } = require('@mutadev/muta-sdk');

async function main() {
  const client = new Client();
  const account = new Account();

  const tx = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: 'My Token' + Math.random(),
      supply: 10000,
      symbol: 'MT',
    },
    sender: account.address,
  });

  const signedTx = account.signTransaction(tx);
  const txHash = await client.sendTransaction(signedTx);
  const receipt = await client.getReceipt(txHash);

  // it would be an empty receipt
  // when we try to `getReceipt` after `sendTransaction` immediately
  // since the receipt should wait for consensus
  console.log(`expect an empty receipt: [${receipt}]`);

  // don't worry, we can retry until consensus successful,
  // which will probably only take a few seconds
  console.log('waiting for creating asset');
  const receipt2 = await retry(() => client.getReceipt(txHash));
  console.log(receipt2);
}

main();
