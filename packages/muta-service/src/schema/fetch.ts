import fetch from 'node-fetch';

/**
 * service schema source, it is [GraphQL](https://graphql.org/learn/schema/)
 * like syntax
 */
type Source = string;

export interface SchemaSource {
  /**
   * service name
   */
  service: string;
  /**
   * method schema
   */
  method: Source;
  /**
   * event schema source
   */
  event: Source;
}

export async function fetchSchemaSource(
  endpoint: string,
): Promise<SchemaSource[]> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
{
  getSchema {
    schema {
      service
      method
      event
    }
  }
}`,
    }),
  });

  const json = await res.json();
  return json?.data?.getSchema?.schema ?? [];
}
