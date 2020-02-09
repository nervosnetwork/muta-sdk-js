import BigNumber from 'bignumber.js';
import { Asset, Client, CreateAssetParam, GetAssetParam, Muta } from '../src';
import { Account } from '../src/account';
import {
  DEFAULT_CONSENSUS_INTERVAL,
  DEFAULT_TIMEOUT_GAP,
} from '../src/constant/constant';
import { Receipt, ServicePayload } from '../src/type';
import { hexToNum, default as utils } from '../src/utils';

/**
 * let us start a simple example to understand Client class
 *
 * Client is a class to help you communicate with Muta chain node without any
 * GraphQL knowledge.
 *
 * To know more about GraphQL and Muta's GraphQL API, please refer to
 * https://graphql.org/
 * and
 * graphql chapter of Muta's doc
 */
(async function ClientExample() {
  /**
   * because Client need to know the GraphQL API URI of the node to send and receive
   * Remote Procedure Calls(RPCs). so we need to pass the GraphQL API URI
   *
   * do you remember at first ex1, when you initial a Muta object, we have passed
   * the GraphQL API as endpoint arg in the param:
   *
   *  const muta = new Muta({
   *  chainId:
   *   '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
   *  endpoint: 'http://127.0.0.1:8000/graphql',  //HERE IS THE ARGU
   *  timeoutGap: DEFAULT_TIMEOUT_GAP,
   *  });
   *
   *  so we could ask Muta object to get the Client object directly
   */

  let client = Muta.createDefaultMutaInstance().client();

  /**
   * or if you want to initialize a customized Client object, you could pass a ClientOption arg
   *
   * export interface ClientOption {
   *  endpoint: string; // you already know it
   *  chainId: string; //the Muta chain id, refer to >>genesis.toml<<
   *  maxTimeout: number; //this is the timeoutGap, please see ex1
   *  defaultCyclesLimit: Uint64; //below
   *  defaultCyclesPrice: Uint64; //below
   * }
   *
   * the client may send transactions to the Muta chain, like most block chains,
   * to prevent infinite loop and turing-complete machine, the defaultCyclesLimit
   * and defaultCyclesPrice will pass to the specific GraphQL APIs when you doesn't
   * specify one explicitly
   *
   * maxTimeout is set to DEFAULT_TIMEOUT_GAP * DEFAULT_CONSENSUS_INTERVAL,
   * we explained DEFAULT_TIMEOUT_GAP in ex1
   * DEFAULT_CONSENSUS_INTERVAL is the default block time to Muta consensus, which is Overlord.
   * you can set maxTimeout to what you want, of course a number :)
   */

  let client = new Client({
    chainId:
      '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
    defaultCyclesLimit: '0xffff',
    defaultCyclesPrice: '0xffff',
    endpoint: 'http://127.0.0.1:8000/graphql',
    maxTimeout: DEFAULT_TIMEOUT_GAP * DEFAULT_CONSENSUS_INTERVAL,
  });

  /**
   * now you can use client to call GraphQL api between your code and the target Muta node
   */

  /**
   * let get the info of certain block
   *
   * to query a certain block, pass a number
   * to query the latest block, pass null
   */

  // let us query the 10th block
  const blockInfo = await client.getBlock('10');

  // let us query the latest block
  const latestBlockInfo = await client.getBlock(null);

  // to get the latest block height
  let latestBlockHeight = hexToNum(latestBlockInfo.header.height);
  // or more easy way
  latestBlockHeight = await client.getLatestBlockHeight();

  /**
   * now let us step further, we want to ask node to do some query.
   * a query is something like eth_call.
   *
   * Muta has many services, e.g., Metadata service and AssetService
   *
   * the metadata service will return the metadata of the Muta Chain
   * the asset service supports User Defined Tokens, something like ERC20
   *
   * now, let us query the node some information from AssetService
   */

  /**
   * to query info with certain service, we must know what kind of data structure
   * to talk with the service.
   *
   * for more info, please refer docs, here we assume you know the specific structure.
   *
   * don't worry, that's obviously easy for AssetService. and if you are a developer
   * of Muta chain, you can define the structure for your own Service :)
   *
   */

  /**
   * let query a Asset by passing an asset-id.
   *
   * by using queryService and queryServiceDyn, we would query info from the node
   *
   * the queryServiceDyn allows us to give the type of inquiry data and return data,
   * and, encode and decode data for us automatically
   *
   * an error should be thrown of cause, since we have not created any UDTs
   */

  let asset: Asset | null = null;
  try {
    const asset_id =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    asset = await client.queryServiceDyn<
      GetAssetParam,
      Asset
      // tslint:disable-next-line:no-object-literal-type-assertion
    >({
      caller: '0x2000000000000000000000000000000000000000',
      method: 'get_balance',
      payload: { asset_id },
      serviceName: 'asset',
    } as ServicePayload<GetAssetParam>);
  } catch (e) {
    asset = null;
  }

  /**
   * now you are able to 'get' info from the node, let us do more thing....
   * try to send some instructions to the node to modify the data on the Muta chain
   *
   * like most block chains, a transaction represents the idea above.
   * so we are going to send transactions to the node.
   *
   * but before we send a tx, we have to compose one tx, right?
   *
   * to send a tx to certain Service, not only AssetService, you must provide 3-factors:
   *
   * export interface ComposeTransactionParam<P> {
   *  timeout?: string;
   *  serviceName: string;
   *  method: string;
   *  payload: P;
   * }
   *
   * timeout, go back to ex1, the timeout is not need since the client will calculate it to us
   * serviceName, to which service to want to talk with
   * method, like RPCs, which method/function yor want to call
   * payload, of cause, the call args
   *
   * let us show we want to send a tx which contains our creating asset intention
   * and refer to the doc, calling create_asset we need a CreateAssetParam, it is:
   *
   * export interface CreateAssetParam {
   *  name: string; //name, give a name for your asset
   *  symbol: string; //symbol, give a **unique**symbol for your asset
   *  supply: number | BigNumber; //supply, give a total supply for your asset
   * }
   */

  /**
   * let us assume we want to create a UDT whos name is LOVE_COIN and symbol is LUV,
   * and we supply it 1314 coins
   */
  const createAssetParam: CreateAssetParam = {
    name: 'LOVE_COIN',
    supply: 1314,
    symbol: 'LUV',
  };

  /**
   * the composeTransaction will ask the node to get the latest height and calculate
   * maxTimeout for us automatically.
   *
   * and we assume you have already take a look at our doc and get the 3-factors
   */
  const tx = await client.composeTransaction<CreateAssetParam>({
    method: 'create_asset',
    payload: createAssetParam,
    serviceName: 'asset',
  });

  /**
   * then we have to sign it to tell the node who is sending the tx
   *
   * do you remember the Account class? we may ask it to sign a tx
   */

  const signedTransaction = Account.fromPrivateKey(
    '0x1000000000000000000000000000000000000000000000000000000000000000',
  ).signTransaction(tx);

  /**
   * OK, we send tx, and like most block chains, the tx is mined async.
   * so at first, we get a txHash of the signedTransaction and then we have to
   * ask the node if the tx is mined
   */

  const txHash = await client.sendTransaction(this.account.signTransaction(tx));

  /**
   *  query the node to see if the tx is mined
   *
   *  this is the sync way, which means the code blocks until the tx is mined
   */

  const receipt: Receipt = await this.client.getReceipt(utils.toHex(txHash));

  /**
   * OK, now you get the receipt, which contains the common result of running a tx
   * and special return data from the Service
   *
   * export interface ReceiptResponse {
   *  serviceName: string;
   *  method: string;
   *  ret: string;
   *  isError: boolean;
   * }
   *
   * the Receipt is the common result of running a tx and the ReceiptResponse inside of Receipt is the
   * special running result of this time, further more, isError indicates the success of this run and ret
   * is what the Service returns you
   *
   *
   * assume you read the doc, the ret field will give you a return of following type if you isError is true
   *
   * export interface Asset {
   *  asset_id: Hash;
   *   name: string;
   *   symbol: string;
   *   supply: number | BigNumber;
   *   issuer: Address;
   * }
   *
   * so we parse it
   */

  let createdAssetResult = utils.safeParseJSON(receipt.response.ret);

  /**
   * now you know all the info about Client class, next ex we will learn AssetService
   * which builds on top of Client class. so you can use simplified APIs rather than
   * the above code :)
   */
})();
