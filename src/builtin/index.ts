import randomBytes from 'random-bytes';
import { Muta } from '../Muta';
import { toHex } from '../utils';

export { AssetService } from './AssetService';

export function createDefaultMutaInstance() {
  return new Muta({
    chainId:
      '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
    endpoint: 'http://127.0.0.1:8000/graphql'
  });
}

const muta = createDefaultMutaInstance();
export function getDefaultMutaInstance() {
  return muta;
}

export function randomAddress() {
  return randomHex(20);
}

export function randomHex(n: number) {
  return toHex(randomBytes.sync(n).toString('hex'));
}
