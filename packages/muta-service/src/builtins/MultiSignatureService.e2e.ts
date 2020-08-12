import { Account } from '@mutadev/account';
import { Client } from '@mutadev/client';
import { MultiSignatureService } from './MultiSignatureService';

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

test('test MultiSignatureService', async () => {
  const service = new MultiSignatureService(client, account1);
  const receipt = await service.write.generate_account({
    autonomy: false,
    addr_with_weight: [
      { address: account1.address, weight: 1 },
      { address: account2.address, weight: 1 },
      { address: account3.address, weight: 1 },
    ],
    memo: 'hello world',
    owner: account1.address,
    threshold: 2,
  });

  expect(Number(receipt.response.response.code)).toBe(0);
});
