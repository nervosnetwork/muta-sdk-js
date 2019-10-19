import ApplloClient from 'apollo-boost';
// tslint:disable-next-line:no-submodule-imports
import 'cross-fetch/polyfill';
import gql from 'graphql-tag';

class Client {
  private readonly endpoint;

  private readonly client: ApplloClient<never>;

  constructor(entry: string) {
    this.endpoint = entry;

    this.client = new ApplloClient({
      uri: this.endpoint
    });
  }

  public getEndPoint(): string {
    return this.endpoint;
  }

  /**
   * get epoch id(or height as a hex string)
   */
  public getLatestEpochId(): Promise<string> {
    return this.client
      .query<any>({
        query: gql`
          {
            getLatestEpoch {
              header {
                epochId
              }
            }
          }
        `
      })
      .then(res => res.data.getLatestEpoch.header.epochId);
  }
}

export { Client };
