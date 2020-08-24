const muta = require('@mutadev/muta-sdk');
const { HDWallet } = require('@mutadev/wallet');

// custom my custom chain hrp
// muta.setDefaultVariables('MUTA_ADDRESS_HRP', 'mc');

function main() {
  const wallet = new HDWallet(HDWallet.generateMnemonic());
  const account0 = wallet.deriveAccount(0);
  console.log('my address0 is: ' + account0.address);

  const account1 = wallet.deriveAccount(1);
  console.log('my address1 is: ' + account1.address);
}

main();
