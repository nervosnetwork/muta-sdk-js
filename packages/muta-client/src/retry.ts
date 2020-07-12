function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_RETRY_TIMEOUT = 100000;
const DEFAULT_RETRY_INTERVAL = 500;
const DEFAULT_RESOLVE_CHECK = () => true;

type PromiseThunk<T> = () => Promise<T>;
type CheckPromise<T> = (x: T) => Promise<boolean> | boolean;

export class Retry<T> {
  private timeout: number = DEFAULT_RETRY_TIMEOUT;
  private interval: number = DEFAULT_RETRY_INTERVAL;
  private promiseThunk!: PromiseThunk<T>;
  private onResolve: CheckPromise<T>;

  constructor(thunk: PromiseThunk<T>) {
    this.promiseThunk = thunk;
    this.onResolve = DEFAULT_RESOLVE_CHECK;
  }

  public static from<T>(promiseThunk: () => Promise<T>): Retry<T> {
    return new Retry<T>(promiseThunk);
  }

  public withPromise(promiseThunk: () => Promise<T>): this {
    this.promiseThunk = promiseThunk;
    return this;
  }

  public withInterval(interval: number): this {
    this.interval = interval || DEFAULT_RETRY_INTERVAL;
    return this;
  }

  public withTimeout(timeout: number): this {
    this.timeout = timeout || DEFAULT_RETRY_TIMEOUT;
    return this;
  }

  public withCheck(check?: CheckPromise<T>): this {
    this.onResolve = check || DEFAULT_RESOLVE_CHECK;
    return this;
  }

  public async start(): Promise<T> {
    if (!this.promiseThunk) {
      throw new Error('');
    }
    const before = Date.now();
    let err: Error = new Error('Retry timeout');
    while (Date.now() - before <= this.timeout) {
      try {
        const res = await this.promiseThunk();
        if (await this.onResolve(res)) {
          return res;
        }
        await wait(this.interval);
      } catch (e) {
        await wait(this.interval);
        err = e;
      }
    }

    return Promise.reject(err);
  }
}

export interface RetryConfig {
  /**
   * the max timeout in (ms)
   */
  timeout?: number;
  /**
   * the retry interval in (ms)
   */
  interval?: number;
}

export interface RetryOptions<T> extends RetryConfig {
  retry: PromiseThunk<T>;
  onResolve?: (t: T) => Promise<boolean> | boolean;
}

const nonNullable = <T>(t: T) => t !== undefined && t !== null;

export function retry<T>(
  options: RetryOptions<T> | PromiseThunk<T>,
): Promise<NonNullable<T>> {
  if (typeof options === 'function') {
    return Retry.from(options)
      .withInterval(DEFAULT_RETRY_INTERVAL)
      .withTimeout(DEFAULT_RETRY_TIMEOUT)
      .withCheck(nonNullable)
      .start() as Promise<NonNullable<T>>;
  }

  return Retry.from(options.retry)
    .withInterval(options.interval || DEFAULT_RETRY_INTERVAL)
    .withTimeout(options.timeout || DEFAULT_RETRY_TIMEOUT)
    .withCheck(options.onResolve || nonNullable)
    .start() as Promise<NonNullable<T>>;
}
