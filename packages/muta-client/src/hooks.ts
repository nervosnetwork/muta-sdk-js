enum HookType {
  BeforeSendTransaction = 'BeforeSendTransaction',
  BeforeQueryService = 'BeforeQueryService',
}

interface Handler<Payload = unknown> {
  (payload: Payload): void | Promise<void>;
}

export interface ClientHook<Payload = unknown> {
  type: HookType;
  handler: Handler<Payload>;
}

interface BeforeSendTransactionHook<Payload = unknown>
  extends ClientHook<Payload> {
  type: HookType.BeforeSendTransaction;
}

export function isBeforeSendTransactionHook(
  x: unknown,
): x is BeforeSendTransactionHook {
  return Object(x).type === HookType.BeforeSendTransaction;
}

interface BeforeSendTransactionOptions<Payload> {
  handler: Handler<Payload>;
}

export function hookOnBeforeSendTransaction<Payload = unknown>(
  options: BeforeSendTransactionOptions<Payload>,
): BeforeSendTransactionHook<Payload> {
  return {
    ...options,
    type: HookType.BeforeSendTransaction,
  };
}

export function chainHandlers<Payload>(
  handlers: Handler<Payload>[],
): Handler<Payload> {
  return async (payload: Payload) => {
    for (const handle of handlers) {
      await handle(payload);
    }
  };
}
