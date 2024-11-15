export const config = {
  // rpc url
  RPC: "https://mainnet.era.zksync.io",

  // internal
  PythOracle: "0xf087c864AEccFb6A2Bf1Af6A0382B0d0f6c5D834",
  PythDataStreamProvider: "0xd962BC6D729EA0233a9B061C121b03232cEBA297",
  OrderHandler: "0x9fE8Aa97f5221Bc73013068123F36dc549a8330f",
  DepositHandler: "0x31532288099C7C4D2f7D1A2578538b9511f71559",
  WithdrawalHandler: "0x06708A03Be87F1493B55Cb1f881952079680CA75",
  
  // mainnet
};

export interface MarketProps {
  marketToken: string;
  indexToken: string;
  longToken: string;
  shortToken: string;
}

export const marketProps: Record<string, MarketProps> = {
  // internal
  "0x29d40D278d95f34366757d42Ea21cf467c7560bE": {
    marketToken: '0x29d40D278d95f34366757d42Ea21cf467c7560bE',
    indexToken: '0x00957c690A5e3f329aDb606baD99cEd9Ad701a98',
    longToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    shortToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
  },
  "0xE416a6a26242CC381805c21F2D681350D87Bd12B": {
    marketToken: '0xE416a6a26242CC381805c21F2D681350D87Bd12B',
    indexToken: '0x00957c690A5e3f329aDb606baD99cEd9Ad701a98',
    longToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    shortToken: '0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83'
  },
  "0xA909580cd2afeb7DBCC29d8F2c075dBDDb5b0DBD": {
    marketToken: '0xA909580cd2afeb7DBCC29d8F2c075dBDDb5b0DBD',
    indexToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    longToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    shortToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
  },
  "0x3721595580D23bE3118eEB6b446Ae12C1DdCDD6f": {
    marketToken: '0x3721595580D23bE3118eEB6b446Ae12C1DdCDD6f',
    indexToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    longToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    shortToken: '0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83'
  },
  "0x2e86533838A51343675315ceE8e65aeE11A72d9e": {
    marketToken: '0x2e86533838A51343675315ceE8e65aeE11A72d9e',
    indexToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    longToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    shortToken: '0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83'
  },
  "0x2A51415912fB514725Bfb3063fB6596Cb5b7d335": {
    marketToken: '0x2A51415912fB514725Bfb3063fB6596Cb5b7d335',
    indexToken: '0x2Bd49911c2816f74116404F8EAC8876e120fb4b9',
    longToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    shortToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
  },
  "0x3eeC03d5DEcD680c4212EaF198b0c5310Ab871cA": {
    marketToken: '0x3eeC03d5DEcD680c4212EaF198b0c5310Ab871cA',
    indexToken: '0x2Bd49911c2816f74116404F8EAC8876e120fb4b9',
    longToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    shortToken: '0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83'
  },
  "0xd2e59a8540f192dedb2f844011bE0A555aE12566": {
    marketToken: '0xd2e59a8540f192dedb2f844011bE0A555aE12566',
    indexToken: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
    longToken: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
    shortToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
  },
  "0x9896dF851Ff1ba9A2A42510dFA892153d85CAd0d": {
    marketToken: '0x9896dF851Ff1ba9A2A42510dFA892153d85CAd0d',
    indexToken: '0x2dEd5585e0bE28bb0735D01c403F064a8986d2B9',
    longToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    shortToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
  },
  "0x3005100644bAbAcc89eDE2b660DcCf785407CBdD": {
    marketToken: '0x3005100644bAbAcc89eDE2b660DcCf785407CBdD',
    indexToken: '0x0000000000000000000000000000000000000000',
    longToken: '0x703b52F2b28fEbcB60E1372858AF5b18849FE867',
    shortToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91'
  },
  "0xcA8A72366AeDcA34f3936E6807e3F5e3A7AFc4C2": {
    marketToken: '0xcA8A72366AeDcA34f3936E6807e3F5e3A7AFc4C2',
    indexToken: '0x0000000000000000000000000000000000000000',
    longToken: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    shortToken: '0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83'
  }

  // mainnet
}

export const feedIdCache: Record<string, string> = {
  "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91" : "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6", // WETH
  "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4" : "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", // USDC
  "0xB21f16d1EA2E8D96CcFafA397cEf855Bf368AA83" : "0x14890ba9c221092cba3d6ce86846d61f8606cefaf3dfc20bf3e2ab99de2644c0", // deUSD
  "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E" : "0xcc03dc09298fb447e0bf9afdb760d5b24340fd2167fd33d8967dd8f9a141a2e8", // ZK
  "0x703b52F2b28fEbcB60E1372858AF5b18849FE867" : "0x6df640f3b8963d8f8358f791f352b8364513f6ab1cca5ed3f1f7b5448980e784", // wstETH
  "0x00957c690A5e3f329aDb606baD99cEd9Ad701a98" : "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", // WBTC
  "0x2Bd49911c2816f74116404F8EAC8876e120fb4b9" : "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // SOL

  "0x2dEd5585e0bE28bb0735D01c403F064a8986d2B9" : "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6", // ETH/BTC
}

export const baseFeedIdCache: Record<string, string> = {
  "0x2dEd5585e0bE28bb0735D01c403F064a8986d2B9" : "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", // ETH/BTC
}


