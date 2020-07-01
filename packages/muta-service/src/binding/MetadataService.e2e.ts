import { Client } from '@mutajs/client';
import { MetadataService } from '@mutajs/service';

const client = new Client();

const service = new MetadataService(client);

test('test MetadataService', async () => {
  const res = await service.get_metadata(null);
  expect(Number(res.code)).toBe(0);
});
