import { MetadataService } from './MetadataService';

const service = new MetadataService();

test('test MetadataService', async () => {
  const res = await service.read.get_metadata();
  expect(Number(res.code)).toBe(0);
});
