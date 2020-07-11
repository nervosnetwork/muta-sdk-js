const { Client, Account, retry } = require('@mutadev/muta-sdk');
const { BigNumber } = require('@mutadev/shared');

const U64_MAX = '18446744073709551616';

// we can use BigNumber.js with a large number
async function main() {
  const client = new Client();
  const account = new Account();

  const tx = await client.composeTransaction({
    serviceName: 'asset',
    method: 'create_asset',
    payload: {
      name: 'LargeToken' + Math.random(),
      supply: new BigNumber(U64_MAX),
      symbol: 'LT',
    },
    sender: account.address,
  });

  const signedTx = account.signTransaction(tx);
  const txHash = await client.sendTransaction(signedTx);

  const receipt = await retry(() => client.getReceipt(txHash));
  console.log(receipt);
}

main();
