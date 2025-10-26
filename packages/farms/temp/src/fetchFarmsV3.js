"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTokenUSDValues = exports.fetchCommonTokenUSDValue = exports.getveCometApr = void 0;
exports.farmV3FetchFarms = farmV3FetchFarms;
exports.fetchMasterChefV3Data = fetchMasterChefV3Data;
exports.getFarmsPrices = getFarmsPrices;
const chains_1 = require("@cometswap/chains");
const tokens_1 = require("@cometswap/tokens");
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const v3_sdk_1 = require("@cometswap/v3-sdk");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const chunk_1 = __importDefault(require("lodash/chunk"));
const viem_1 = require("viem");
const price_api_sdk_1 = require("@cometswap/price-api-sdk");
const common_1 = require("../constants/common");
const apr_1 = require("./apr");
const const_1 = require("./const");
const chainlinkAbi = [
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
async function farmV3FetchFarms({ farms, provider, masterChefAddress, chainId, totalAllocPoint, commonPrice, }) {
    const [poolInfos, cometPrice, v3PoolData] = await Promise.all([
        fetchPoolInfos(farms, chainId, provider, masterChefAddress),
        provider({ chainId: chains_1.ChainId.BSC })
            .readContract({
            abi: chainlinkAbi,
            address: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
            functionName: 'latestAnswer',
        })
            .then((res) => (0, viem_1.formatUnits)(res, 8)),
        fetchV3Pools(farms, chainId, provider),
    ]);
    const lmPoolInfos = await fetchLmPools(v3PoolData.map((v3Pool) => (v3Pool[1] ? v3Pool[1] : null)).filter(Boolean), chainId, provider);
    const farmsData = farms
        .map((farm, index) => {
        const { token, quoteToken, ...f } = farm;
        if (!v3PoolData[index][1]) {
            return null;
        }
        const lmPoolAddress = v3PoolData[index][1];
        return {
            ...f,
            token,
            quoteToken,
            lmPool: lmPoolAddress,
            lmPoolLiquidity: lmPoolInfos[lmPoolAddress].liquidity,
            _rewardGrowthGlobalX128: lmPoolInfos[lmPoolAddress].rewardGrowthGlobalX128,
            ...getV3FarmsDynamicData({
                tick: v3PoolData[index][0][1],
                token0: farm.token,
                token1: farm.quoteToken,
            }),
            ...getFarmAllocation({
                allocPoint: poolInfos[index]?.[0],
                totalAllocPoint,
            }),
        };
    })
        .filter(Boolean);
    const defaultCommonPrice = const_1.supportedChainIdV3.includes(chainId)
        ? common_1.DEFAULT_COMMON_PRICE[chainId]
        : {};
    const combinedCommonPrice = {
        ...defaultCommonPrice,
        ...commonPrice,
    };
    const farmsWithPrice = getFarmsPrices(farmsData, cometPrice, combinedCommonPrice);
    return farmsWithPrice;
}
const masterchefV3Abi = [
    {
        inputs: [],
        name: 'latestPeriodveCometPerSecond',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'poolInfo',
        outputs: [
            { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { internalType: 'contract ICometV3Pool', name: 'v3Pool', type: 'address' },
            { internalType: 'address', name: 'token0', type: 'address' },
            { internalType: 'address', name: 'token1', type: 'address' },
            { internalType: 'uint24', name: 'fee', type: 'uint24' },
            { internalType: 'uint256', name: 'totalLiquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'totalBoostLiquidity', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poolLength',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalAllocPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
async function fetchMasterChefV3Data({ provider, masterChefAddress, chainId, }) {
    const [poolLength, totalAllocPoint, latestPeriodveCometPerSecond] = await provider({ chainId }).multicall({
        contracts: [
            {
                address: masterChefAddress,
                abi: masterchefV3Abi,
                functionName: 'poolLength',
            },
            {
                address: masterChefAddress,
                abi: masterchefV3Abi,
                functionName: 'totalAllocPoint',
            },
            {
                address: masterChefAddress,
                abi: masterchefV3Abi,
                functionName: 'latestPeriodveCometPerSecond',
            },
        ],
        allowFailure: false,
    });
    return {
        poolLength,
        totalAllocPoint,
        latestPeriodveCometPerSecond,
    };
}
/**
 *
 * @returns
 * ```
   {
    // allocPoint: BigNumber
    0: bigint
    // v3Pool: string
    1: Address
    // token0: string
    2: Address
    // token1: string
    3: Address
    // fee: number
    4: number
    // totalLiquidity: BigNumber
    5: bigint
    // totalBoostLiquidity: BigNumber
    6: bigint
  }[]
 * ```
 */
const fetchPoolInfos = async (farms, chainId, provider, masterChefAddress) => {
    try {
        const calls = farms.map((farm) => ({
            abi: masterchefV3Abi,
            address: masterChefAddress,
            functionName: 'poolInfo',
            args: [BigInt(farm.pid)],
        }));
        const masterChefMultiCallResult = await provider({ chainId }).multicall({
            contracts: calls,
            allowFailure: false,
        });
        let masterChefChunkedResultCounter = 0;
        return calls.map((masterChefCall) => {
            if (masterChefCall === null) {
                return null;
            }
            const data = masterChefMultiCallResult[masterChefChunkedResultCounter];
            masterChefChunkedResultCounter++;
            return data;
        });
    }
    catch (error) {
        console.error('MasterChef Pool info data error', error);
        throw error;
    }
};
const getveCometApr = (poolWeight, activeTvlUSD, cakePriceUSD, cakePerSecond) => {
    return (0, apr_1.getFarmApr)({
        poolWeight,
        tvlUsd: activeTvlUSD,
        cakePriceUsd: cakePriceUSD,
        cakePerSecond,
        precision: 6,
    });
};
exports.getveCometApr = getveCometApr;
const getV3FarmsDynamicData = ({ token0, token1, tick }) => {
    const tokenPriceVsQuote = (0, v3_sdk_1.tickToPrice)(token0, token1, tick);
    return {
        tokenPriceVsQuote: tokenPriceVsQuote.toSignificant(6),
    };
};
const getFarmAllocation = ({ allocPoint, totalAllocPoint }) => {
    const _allocPoint = typeof allocPoint !== 'undefined' ? new bignumber_js_1.default(allocPoint.toString()) : bigNumber_1.BIG_ZERO;
    const poolWeight = !!totalAllocPoint && !_allocPoint.isZero() ? _allocPoint.div(totalAllocPoint.toString()) : bigNumber_1.BIG_ZERO;
    return {
        poolWeight: poolWeight.toString(),
        multiplier: !_allocPoint.isZero() ? `${+_allocPoint.div(10).toString()}X` : `0X`,
    };
};
const lmPoolAbi = [
    {
        inputs: [],
        name: 'lmLiquidity',
        outputs: [
            {
                internalType: 'uint128',
                name: '',
                type: 'uint128',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rewardGrowthGlobalX128',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const v3PoolAbi = [
    {
        inputs: [],
        name: 'lmPool',
        outputs: [{ internalType: 'contract ICometV3LmPool', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'slot0',
        outputs: [
            { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
            { internalType: 'int24', name: 'tick', type: 'int24' },
            { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
            { internalType: 'uint16', name: 'observationCardinality', type: 'uint16' },
            { internalType: 'uint16', name: 'observationCardinalityNext', type: 'uint16' },
            { internalType: 'uint32', name: 'feeProtocol', type: 'uint32' },
            { internalType: 'bool', name: 'unlocked', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
async function fetchLmPools(lmPoolAddresses, chainId, provider) {
    const lmPoolCalls = lmPoolAddresses.flatMap((address) => [
        {
            abi: lmPoolAbi,
            address,
            functionName: 'lmLiquidity',
        },
        {
            abi: lmPoolAbi,
            address,
            functionName: 'rewardGrowthGlobalX128',
        },
    ]);
    const chunkSize = lmPoolCalls.length / lmPoolAddresses.length;
    const resp = await provider({ chainId }).multicall({
        contracts: lmPoolCalls,
        allowFailure: true,
    });
    const chunked = (0, chunk_1.default)(resp, chunkSize);
    const lmPools = {};
    for (const [index, res] of chunked.entries()) {
        lmPools[lmPoolAddresses[index]] = {
            liquidity: res?.[0]?.result?.toString() ?? '0',
            rewardGrowthGlobalX128: res?.[1]?.result?.toString() ?? '0',
        };
    }
    return lmPools;
}
async function fetchV3Pools(farms, chainId, provider) {
    const v3PoolCalls = farms.flatMap((f) => [
        {
            abi: v3PoolAbi,
            address: f.lpAddress,
            functionName: 'slot0',
        },
        {
            abi: v3PoolAbi,
            address: f.lpAddress,
            functionName: 'lmPool',
        },
    ]);
    const chunkSize = v3PoolCalls.length / farms.length;
    const resp = await provider({ chainId }).multicall({
        contracts: v3PoolCalls,
        allowFailure: false,
    });
    return (0, chunk_1.default)(resp, chunkSize);
}
const fetchCommonTokenUSDValue = async (priceHelper) => {
    return (0, exports.fetchTokenUSDValues)(priceHelper?.list || []);
};
exports.fetchCommonTokenUSDValue = fetchCommonTokenUSDValue;
const fetchTokenUSDValues = async (currencies = []) => {
    const commonTokenUSDValue = {};
    if (!const_1.supportedChainIdV3.includes(currencies[0]?.chainId)) {
        return commonTokenUSDValue;
    }
    if (currencies.length > 0) {
        const prices = await (0, price_api_sdk_1.getCurrencyListUsdPrice)(currencies);
        Object.entries(prices || {}).forEach(([key, value]) => {
            const [, address] = key.split(':');
            commonTokenUSDValue[(0, viem_1.getAddress)(address)] = value.toString();
        });
    }
    return commonTokenUSDValue;
};
exports.fetchTokenUSDValues = fetchTokenUSDValues;
function getFarmsPrices(farms, cakePriceUSD, commonPrice) {
    const commonPriceFarms = farms.map((farm) => {
        let tokenPriceBusd = bigNumber_1.BIG_ZERO;
        let quoteTokenPriceBusd = bigNumber_1.BIG_ZERO;
        // try to get price via common price
        if (commonPrice[farm.quoteToken.address]) {
            quoteTokenPriceBusd = new bignumber_js_1.default(commonPrice[farm.quoteToken.address]);
        }
        if (commonPrice[farm.token.address]) {
            tokenPriceBusd = new bignumber_js_1.default(commonPrice[farm.token.address]);
        }
        // try price via COMET
        if (tokenPriceBusd.isZero() &&
            farm.token.chainId in tokens_1.COMET &&
            farm.token.equals(tokens_1.COMET[farm.token.chainId])) {
            tokenPriceBusd = new bignumber_js_1.default(cakePriceUSD);
        }
        if (quoteTokenPriceBusd.isZero() &&
            farm.quoteToken.chainId in tokens_1.COMET &&
            farm.quoteToken.equals(tokens_1.COMET[farm.quoteToken.chainId])) {
            quoteTokenPriceBusd = new bignumber_js_1.default(cakePriceUSD);
        }
        // try to get price via token price vs quote
        if (tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
            tokenPriceBusd = quoteTokenPriceBusd.times(farm.tokenPriceVsQuote);
        }
        if (quoteTokenPriceBusd.isZero() && !tokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
            quoteTokenPriceBusd = tokenPriceBusd.div(farm.tokenPriceVsQuote);
        }
        return {
            ...farm,
            tokenPriceBusd,
            quoteTokenPriceBusd,
        };
    });
    return commonPriceFarms.map((farm) => {
        let { tokenPriceBusd, quoteTokenPriceBusd } = farm;
        // if token price is zero, try to get price from existing farms
        if (tokenPriceBusd.isZero()) {
            const ifTokenPriceFound = commonPriceFarms.find((f) => (farm.token.equals(f.token) && !f.tokenPriceBusd.isZero()) ||
                (farm.token.equals(f.quoteToken) && !f.quoteTokenPriceBusd.isZero()));
            if (ifTokenPriceFound) {
                tokenPriceBusd = farm.token.equals(ifTokenPriceFound.token)
                    ? ifTokenPriceFound.tokenPriceBusd
                    : ifTokenPriceFound.quoteTokenPriceBusd;
            }
            if (quoteTokenPriceBusd.isZero()) {
                const ifQuoteTokenPriceFound = commonPriceFarms.find((f) => (farm.quoteToken.equals(f.token) && !f.tokenPriceBusd.isZero()) ||
                    (farm.quoteToken.equals(f.quoteToken) && !f.quoteTokenPriceBusd.isZero()));
                if (ifQuoteTokenPriceFound) {
                    quoteTokenPriceBusd = farm.quoteToken.equals(ifQuoteTokenPriceFound.token)
                        ? ifQuoteTokenPriceFound.tokenPriceBusd
                        : ifQuoteTokenPriceFound.quoteTokenPriceBusd;
                }
                // try to get price via token price vs quote
                if (tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
                    tokenPriceBusd = quoteTokenPriceBusd.times(farm.tokenPriceVsQuote);
                }
                if (quoteTokenPriceBusd.isZero() && !tokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
                    quoteTokenPriceBusd = tokenPriceBusd.div(farm.tokenPriceVsQuote);
                }
                if (tokenPriceBusd.isZero()) {
                    console.error(`Can't get price for ${farm.token.address}`);
                }
                if (quoteTokenPriceBusd.isZero()) {
                    console.error(`Can't get price for ${farm.quoteToken.address}`);
                }
            }
        }
        return {
            ...farm,
            tokenPriceBusd: tokenPriceBusd.toString(),
            // adjust the quote token price by the token price vs quote
            quoteTokenPriceBusd: !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote
                ? tokenPriceBusd.div(farm.tokenPriceVsQuote).toString()
                : quoteTokenPriceBusd.toString(),
        };
    });
}
