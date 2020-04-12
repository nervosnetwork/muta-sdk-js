function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_RETRY_TIMEOUT = 100000;
const DEFAULT_RETRY_INTERVAL = 500;

type CheckPromise<T> = (x: T) => Promise<boolean> | boolean;

export class Retry<T> {
  private promiseThunk: () => Promise<T>;
  private timeout: number = DEFAULT_RETRY_TIMEOUT;
  private interval: number = DEFAULT_RETRY_INTERVAL;
  private onResolve: CheckPromise<T>;

  public static from<T>(promiseThunk: () => Promise<T>): Retry<T> {
    return new Retry<T>().withPromise(promiseThunk);
  }

  public withPromise(promiseThunk: () => Promise<T>): this {
    this.promiseThunk = promiseThunk;
    this.onResolve = () => true;
    return this;
  }

  public withInterval(interval: number): this {
    this.interval = interval || this.interval;
    return this;
  }

  public withTimeout(timeout: number): this {
    this.timeout = timeout || this.timeout;
    return this;
  }

  public withCheck(check: CheckPromise<T>): this {
    this.onResolve = check || this.onResolve;
    return this;
  }

  public async start(): Promise<T> {
    const before = Date.now();
    let err: Error;
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

    return Promise.reject(err || 'Retry timeout');
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
  retry: () => Promise<T>;
  onResolve?: (t: T) => Promise<boolean> | boolean;
}

export function retry<T>(options: RetryOptions<T>): Promise<T> {
  return Retry.from(options.retry)
    .withInterval(options.interval || DEFAULT_RETRY_INTERVAL)
    .withTimeout(options.timeout || DEFAULT_RETRY_TIMEOUT)
    .withCheck(options.onResolve)
    .start();
}
