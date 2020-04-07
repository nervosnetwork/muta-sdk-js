import { Account } from '@mutajs/account';
import { Client } from '@mutajs/client';
import test from 'ava';
import { MetadataService } from './MetadataService';

const account = Account.fromPrivateKey(
  '0x45c56be699dca666191ad3446897e0f480da234da896270202514a0e1a587c3f',
);
const client = new Client();

const service = new MetadataService(client, account);

test('test MetadataService', async t => {
  const res = await service.get_metadata();
  t.is(Number(res.code), 0, 'response code should be 0');
});
