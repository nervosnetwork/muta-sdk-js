import { Account } from '@mutadev/account';
import { MultiSignatureService } from './MultiSignatureService';

const account1 = new Account();
const account2 = new Account(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
);
const account3 = new Account(
  '0x0000000000000000000000000000000000000000000000000000000000000003',
);

test('test MultiSignatureService', async () => {
  const service = new MultiSignatureService();
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
