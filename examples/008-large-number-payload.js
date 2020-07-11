// there is a [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
// trap in JavaScript, so we need to be careful to avoid using numbers
// directly when calculating large numbers

const { Client, Account, retry, utils } = require('@mutadev/muta-sdk');
const { BigNumber } = require('@mutadev/shared');

const U64_MAX = '18446744073709551615';

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

  console.log('waiting for creating asset');
  const receipt = await retry(() => client.getReceipt(txHash));

  const asset = utils.safeParseJSON(receipt.response.response.succeedData);
  console.log(`asset supply: ${asset.supply.toString()}`);

  const bigSupply = new BigNumber(asset.supply);
  const bigU64Max = new BigNumber(U64_MAX);
  console.log(`supply is equals to U64_MAX: [${bigSupply.eq(bigU64Max)}]`);
}

main();
