const { Client } = require('@mutadev/muta-sdk');

async function main() {
  const client = new Client({
    endpoint: 'http://localhost:8000/graphql',
  });

  const block = await client.getBlock();
  console.log(`current height(hex): ${block.header.height}`);
  console.log(`current height(decimal): ${Number(block.header.height)}`);
}

main();
