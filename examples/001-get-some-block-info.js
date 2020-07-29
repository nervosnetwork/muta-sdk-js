const { Client, utils } = require('@mutadev/muta-sdk');

async function main() {
  // const client = new Client({
  //   endpoint: 'http://localhost:8000/graphql',
  //   account: new Account(
  //     '0x0000000000000000000000000000000000000000000000000000000000000001',
  //   ),
  //   chainId:
  //     '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
  //   consensusInterval: 3000,
  //   defaultCyclesLimit: '0xffffffff',
  //   defaultCyclesPrice: '0xffffffff',
  //   maxTimeout: 60000,
  //   timeoutGap: 20,
  //   serializer: {
  //     deserialize: utils.safeParseJSON,
  //     serialize: utils.safeStringifyJSON,
  //   },
  // });

  const client = new Client();

  const block = await client.getBlock();
  console.log(`current height(hex): ${block.header.height}`);
  console.log(`current height(decimal): ${Number(block.header.height)}`);
}

main();
