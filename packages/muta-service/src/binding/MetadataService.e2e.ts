import { Client } from '@mutadev/client';
import { MetadataService } from '@mutadev/service';

const client = new Client();

const service = new MetadataService(client);

test('test MetadataService', async () => {
  const res = await service.get_metadata(null);
  expect(Number(res.code)).toBe(0);
});
