import { fetchSchemaSource } from './fetch';

test('test fetch schema should be an array', async () => {
  const schemaSources = await fetchSchemaSource(
    'http://127.0.0.1:8000/graphql',
  );

  expect(Array.isArray(schemaSources)).toBe(true);
});
