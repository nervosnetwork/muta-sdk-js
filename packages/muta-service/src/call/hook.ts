import { Receipt, ServiceResponse } from '@mutajs/types';
import { safeParseJSON, safeStringifyJSON } from '@mutajs/utils';
import { defaults, identity } from 'lodash';

type PromiseLike<T> = T | Promise<T>;

export interface QueryHook<Payload = any, Response = any> {
  handlePayload(payload: Payload): PromiseLike<Payload>;

  handleResponse(response: ServiceResponse): PromiseLike<Response>;
}

export function query<Payload, Response>(
  hook?: Partial<QueryHook<Payload, Response>>,
): QueryHook<Payload, Response> {
  return defaults(hook, {
    handlePayload: payload => {
      return typeof payload !== 'string' ? safeStringifyJSON(payload) : payload;
    },
    handleResponse: (res) => {
      return {
        ...res,
        succeedData: safeParseJSON(res.succeedData),
      }
    },
  });
}

export interface MutationHook<Payload = any, Response = any> {
  handlePayload(payload: Payload): PromiseLike<Payload>;

  handleResponse(response: Receipt): PromiseLike<Response>;
}

export function mutation<Payload, Response>(
  hook?: Partial<MutationHook<Payload, Response>>,
) {
  return defaults(hook, {
    handlePayload: identity,
    handleResponse: receipt => {
      try {
        receipt.response.response.succeedData = safeParseJSON(
          receipt.response.response.succeedData,
        );
      } catch {}
      return receipt;
    },
  });
}
