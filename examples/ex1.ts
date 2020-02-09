import { Muta } from '../src';
import { DEFAULT_TIMEOUT_GAP } from '../src/constant/constant';

/**
 * let us start a simple example to understand Muta class
 *
 * to get Muta js-sdk, please npm install muta-sdk
 */
(async function MutaExample() {
  const muta = new Muta({
    /**
     *  suppose that you define 0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036,
     *  which is Muta's default chain_id, in >>genesis.toml<<
     *
     */
    chainId:
      '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',

    /**
     *  the GraphQL API uri, which is take responsibility to send rpc to the node
     *  the config can be found under [graphql] section in the >>config.toml file<<
     */
    endpoint: 'http://127.0.0.1:8000/graphql',

    /**
     * timeout_gap represent how many block a pending tx should be supposed to be mined.
     * if the block height advances and surpass the timeoutGap of the tx, the tx
     * is considered to be stale and will be dropped by the chain.
     *
     * the timeoutGap has NO DEFAULT value in Muta chain, but js-sdk prefer 20
     */
    timeoutGap: DEFAULT_TIMEOUT_GAP,
  });

  /**
   * the above params are often used in test chain, so use createDefaultMutaInstance to get it
   */
  const mutaByDefaultConfig = Muta.createDefaultMutaInstance();

  /**
   * since you get a Muta object, it's the time we go on to next example, HDWallet
   */
})();
