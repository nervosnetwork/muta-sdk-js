const { Client } = require('@mutadev/muta-sdk');

async function main() {
  const client = new Client();
  const res = await client.queryService({
    serviceName: 'metadata',
    method: 'get_metadata',
    payload: '',
  });

  const metadata = JSON.parse(res.succeedData);
  console.log('metadata: ');
  console.log(metadata);
}

main();
