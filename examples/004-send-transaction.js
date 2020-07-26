const { Client, Account } = require('@mutadev/muta-sdk');

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
  console.log(`txHash: [${txHash}]`);
}

main();
