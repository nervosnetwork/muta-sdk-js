function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type CheckPromise<T> = (x: T) => boolean;

export class Retry<T> {
  public static from<T>(promiseThunk: () => Promise<T>): Retry<T> {
    return new Retry<T>().withPromise(promiseThunk);
  }

  private promiseThunk: () => Promise<T>;

  private timeout: number = 6000;

  private internal: number = 500;

  public withPromise(promiseThunk: () => Promise<T>): this {
    this.promiseThunk = promiseThunk;
    return this;
  }

  public withInternal(internal: number): this {
    this.internal = internal;
    return this;
  }

  public withTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  public withCheck(check: CheckPromise<T>): this {
    this.check = check;
    return this;
  }

  public async start(): Promise<T> {
    const before = Date.now();
    let err: Error;
    while (Date.now() - before <= this.timeout) {
      try {
        const res = await this.promiseThunk();
        if (this.check(res)) {
          return res;
        }
        await wait(this.internal);
      } catch (e) {
        await wait(this.internal);
        err = e;
      }
    }

    return Promise.reject(err || new Error('retry timeout'));
  }

  private check: CheckPromise<T> = () => true;
}
