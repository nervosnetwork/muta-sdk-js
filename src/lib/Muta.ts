import { Client } from '..';

class Muta {
  private readonly client: Client;

  constructor(endpoint) {
    this.client = new Client(endpoint);
  }

  public getClient(): Client {
    return this.client;
  }
}

export { Muta };
