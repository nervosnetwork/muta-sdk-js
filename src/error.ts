export class MutaSDKError extends Error {}

export function isError(x: unknown): x is Error {
  return x instanceof Error;
}

export function boom(message: string | Error) {
  if (isError(message)) {
    return message;
  }

  return new MutaSDKError(message);
}
