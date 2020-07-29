import { request } from 'graphql-request';
import { chunk, reduce } from 'lodash';
import { default as plimit } from 'p-limit';

export type Batched<T> = {
  [key: string]: T;
};

export async function batchWithSameFragment<T>(
  endpoint: string,
  queries: string,
  fragment: string,
): Promise<Batched<T>> {
  const batched = await request(
    endpoint,
    `
      {
        ${queries}
      }
      ${fragment}
    `,
  );

  return batched as Batched<T>;
}

interface ChunkAndBatchOption<Source> {
  endpoint: string;
  taskSource: Source[];
  generateQuerySegment: (x: Source, i: number) => string;
  chunkSize: number;
  concurrency: number;
  fragment: string;
}

export async function chunkAndBatch<Result, Source = string>(
  options: ChunkAndBatchOption<Source>,
): Promise<Batched<Result>> {
  const {
    taskSource,
    fragment,
    generateQuerySegment,
    chunkSize,
    concurrency,
  } = options;

  const queries = taskSource.map(generateQuerySegment);
  const chunkedQueries = chunk(queries, chunkSize).map((chunkedQueryString) =>
    chunkedQueryString.join('\n'),
  );

  const limit = plimit(concurrency);

  const chunkedAndBatched = await Promise.all(
    chunkedQueries.map((queries) =>
      limit(() =>
        batchWithSameFragment<Result>(options.endpoint, queries, fragment),
      ),
    ),
  );

  return reduce<Batched<Result>[], Batched<Result>>(
    chunkedAndBatched,
    (batched, item) => {
      return Object.assign(batched, item);
    },
    {} as Batched<Result>,
  );
}
