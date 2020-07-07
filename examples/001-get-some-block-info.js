const { Client } = require('../packages/muta-client');

async function main() {
  const client = new Client({
    endpoint: 'http://localhost:8000/graphql',
  });

  const block = await client.getBlock();
  console.log(block.header.height);
}

main();
