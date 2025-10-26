"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMasterChefV2Data = exports.fetchMasterChefData = exports.getTokenAmount = void 0;
exports.farmV2FetchFarms = farmV2FetchFarms;
const chains_1 = require("@cometswap/chains");
const price_api_sdk_1 = require("@cometswap/price-api-sdk");
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const viem_1 = require("viem");
const const_1 = require("../const");
const types_1 = require("../types");
const farmPrices_1 = require("./farmPrices");
const fetchPublicFarmData_1 = require("./fetchPublicFarmData");
const fetchStableFarmData_1 = require("./fetchStableFarmData");
const getFullDecimalMultiplier_1 = require("./getFullDecimalMultiplier");
const evmNativeStableLpMap = {
    [chains_1.ChainId.ETHEREUM]: {
        address: '0x2E8135bE71230c6B1B4045696d41C09Db0414226',
        wNative: 'WETH',
        stable: 'USDC',
    },
    [chains_1.ChainId.GOERLI]: {
        address: '0xf5bf0C34d3c428A74Ceb98d27d38d0036C587200',
        wNative: 'WETH',
        stable: 'tUSDC',
    },
    [chains_1.ChainId.BSC]: {
        address: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
        wNative: 'WBNB',
        stable: 'BUSD',
    },
    [chains_1.ChainId.BSC_TESTNET]: {
        address: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
        wNative: 'WBNB',
        stable: 'BUSD',
    },
    [chains_1.ChainId.ARBITRUM_ONE]: {
        address: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
        wNative: 'WETH',
        stable: 'USDC',
    },
};
const getTokenAmount = (balance, decimals) => {
    return balance.div((0, getFullDecimalMultiplier_1.getFullDecimalMultiplier)(decimals));
};
exports.getTokenAmount = getTokenAmount;
async function farmV2FetchFarms({ farms, provider, isTestnet, masterChefAddress, chainId, totalRegularAllocPoint, totalSpecialAllocPoint, }) {
    if (!const_1.supportedChainIdV2.includes(chainId)) {
        return [];
    }
    const stableFarms = farms.filter(types_1.isStableFarm);
    const [stableFarmsResults, poolInfos, lpDataResults] = await Promise.all([
        (0, fetchStableFarmData_1.fetchStableFarmData)(stableFarms, chainId, provider),
        (0, exports.fetchMasterChefData)(farms, isTestnet, provider, masterChefAddress),
        (0, fetchPublicFarmData_1.fetchPublicFarmsData)(farms, chainId, provider, masterChefAddress),
    ]);
    const stableFarmsData = stableFarmsResults.map(formatStableFarm);
    const stableFarmsDataMap = stableFarms.reduce((map, farm, index) => {
        return {
            ...map,
            [farm.pid]: stableFarmsData[index],
        };
    }, {});
    const lpData = lpDataResults.map(formatClassicFarmResponse);
    const farmsData = farms.map((farm, index) => {
        try {
            return {
                ...farm,
                ...(stableFarmsDataMap[farm.pid]
                    ? getStableFarmDynamicData({
                        ...lpData[index],
                        ...stableFarmsDataMap[farm.pid],
                        token0Decimals: farm.token.decimals,
                        token1Decimals: farm.quoteToken.decimals,
                        price1: stableFarmsDataMap[farm.pid].price1,
                    })
                    : getClassicFarmsDynamicData({
                        ...lpData[index],
                        ...stableFarmsDataMap[farm.pid],
                        token0Decimals: farm.token.decimals,
                        token1Decimals: farm.quoteToken.decimals,
                    })),
                // TODO: remove hardcode allocPoint & totalRegularAllocPoint later
                ...getFarmAllocation({
                    allocPoint: BigInt(farm?.allocPoint ?? 0) ?? poolInfos[index]?.allocPoint,
                    isRegular: poolInfos[index]?.isRegular,
                    totalRegularAllocPoint: BigInt(2305) || totalRegularAllocPoint,
                    totalSpecialAllocPoint,
                }),
            };
        }
        catch (error) {
            console.error(error, farm, index, {
                allocPoint: poolInfos[index]?.allocPoint,
                isRegular: poolInfos[index]?.isRegular,
                token0Decimals: farm.token.decimals,
                token1Decimals: farm.quoteToken.decimals,
                totalRegularAllocPoint,
                totalSpecialAllocPoint,
            });
            throw error;
        }
    });
    const decimals = 18;
    const farmsDataWithPrices = (0, farmPrices_1.getFarmsPrices)(farmsData, evmNativeStableLpMap[chainId], decimals);
    const tokensWithoutPrice = farmsDataWithPrices.reduce((acc, cur) => {
        if (cur.tokenPriceBusd === '0') {
            acc.set(cur.token.address, cur.token);
        }
        if (cur.quoteTokenPriceBusd === '0') {
            acc.set(cur.quoteToken.address, cur.quoteToken);
        }
        return acc;
    }, new Map());
    const tokenInfoList = Array.from(tokensWithoutPrice.values());
    if (tokenInfoList.length) {
        const prices = await (0, price_api_sdk_1.getCurrencyListUsdPrice)(tokenInfoList);
        return farmsDataWithPrices.map((f) => {
            if (f.tokenPriceBusd !== '0' && f.quoteTokenPriceBusd !== '0') {
                return f;
            }
            const tokenKey = (0, price_api_sdk_1.getCurrencyKey)(f.token);
            const quoteTokenKey = (0, price_api_sdk_1.getCurrencyKey)(f.quoteToken);
            const tokenVsQuote = new bignumber_js_1.default(f.tokenPriceVsQuote);
            let tokenPrice = new bignumber_js_1.default(tokenKey ? prices[tokenKey] ?? 0 : 0);
            let quoteTokenPrice = new bignumber_js_1.default(quoteTokenKey ? prices[quoteTokenKey] ?? 0 : 0);
            if (tokenVsQuote.gt(0)) {
                if (tokenPrice.eq(0) && quoteTokenPrice.gt(0)) {
                    tokenPrice = quoteTokenPrice.div(tokenVsQuote);
                }
                else if (quoteTokenPrice.eq(0) && tokenPrice.gt(0)) {
                    quoteTokenPrice = tokenPrice.times(tokenVsQuote);
                }
            }
            const lpTokenPrice = (0, farmPrices_1.getFarmLpTokenPrice)(f, tokenPrice, quoteTokenPrice, decimals);
            return {
                ...f,
                tokenPriceBusd: tokenPrice.toString(),
                quoteTokenPriceBusd: quoteTokenPrice.toString(),
                lpTokenPrice: lpTokenPrice.toString(),
            };
        });
    }
    return farmsDataWithPrices;
}
const masterChefV2Abi = [
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'poolInfo',
        outputs: [
            { internalType: 'uint256', name: 'accveCometPerShare', type: 'uint256' },
            { internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256' },
            { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { internalType: 'uint256', name: 'totalBoostedShare', type: 'uint256' },
            { internalType: 'bool', name: 'isRegular', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poolLength',
        outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalRegularAllocPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSpecialAllocPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'bool', name: '_isRegular', type: 'bool' }],
        name: 'cakePerBlock',
        outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
const masterChefFarmCalls = (farm, masterChefAddress) => {
    const { pid } = farm;
    return pid || pid === 0
        ? {
            abi: masterChefV2Abi,
            address: masterChefAddress,
            functionName: 'poolInfo',
            args: [BigInt(pid)],
        }
        : null;
};
function notEmpty(value) {
    return value !== null && value !== undefined;
}
const fetchMasterChefData = async (farms, isTestnet, provider, masterChefAddress) => {
    try {
        const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, masterChefAddress));
        const masterChefAggregatedCalls = masterChefCalls.filter(notEmpty);
        const chainId = isTestnet ? chains_1.ChainId.BSC_TESTNET : chains_1.ChainId.BSC;
        const masterChefMultiCallResult = await provider({ chainId }).multicall({
            contracts: masterChefAggregatedCalls,
            allowFailure: false,
        });
        let masterChefChunkedResultCounter = 0;
        return masterChefCalls.map((masterChefCall) => {
            if (masterChefCall === null) {
                return null;
            }
            const data = masterChefMultiCallResult[masterChefChunkedResultCounter];
            masterChefChunkedResultCounter++;
            return {
                accveCometPerShare: data[0],
                lastRewardBlock: data[1],
                allocPoint: data[2],
                totalBoostedShare: data[3],
                isRegular: data[4],
            };
        });
    }
    catch (error) {
        console.error('MasterChef Pool info data error', error);
        throw error;
    }
};
exports.fetchMasterChefData = fetchMasterChefData;
const fetchMasterChefV2Data = async ({ provider, isTestnet, masterChefAddress, }) => {
    try {
        const chainId = isTestnet ? chains_1.ChainId.BSC_TESTNET : chains_1.ChainId.BSC;
        const [poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock] = await provider({
            chainId,
        }).multicall({
            contracts: [
                {
                    abi: masterChefV2Abi,
                    address: masterChefAddress,
                    functionName: 'poolLength',
                },
                {
                    abi: masterChefV2Abi,
                    address: masterChefAddress,
                    functionName: 'totalRegularAllocPoint',
                },
                {
                    abi: masterChefV2Abi,
                    address: masterChefAddress,
                    functionName: 'totalSpecialAllocPoint',
                },
                {
                    abi: masterChefV2Abi,
                    address: masterChefAddress,
                    functionName: 'cakePerBlock',
                    args: [true],
                },
            ],
            allowFailure: false,
        });
        return {
            poolLength,
            totalRegularAllocPoint,
            totalSpecialAllocPoint,
            cakePerBlock,
        };
    }
    catch (error) {
        console.error('Get MasterChef data error', error);
        throw error;
    }
};
exports.fetchMasterChefV2Data = fetchMasterChefV2Data;
const formatStableFarm = (stableFarmData) => {
    const [balance1, balance2, _, _price1] = stableFarmData;
    return {
        tokenBalanceLP: new bignumber_js_1.default(balance1.toString()),
        quoteTokenBalanceLP: new bignumber_js_1.default(balance2.toString()),
        price1: _price1,
    };
};
const getStableFarmDynamicData = ({ lpTokenBalanceMC, lpTotalSupply, quoteTokenBalanceLP, tokenBalanceLP, token0Decimals, token1Decimals, price1, }) => {
    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = (0, exports.getTokenAmount)(tokenBalanceLP, token0Decimals);
    const quoteTokenAmountTotal = (0, exports.getTokenAmount)(quoteTokenBalanceLP, token1Decimals);
    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.div(lpTotalSupply) : bigNumber_1.BIG_ZERO;
    const tokenPriceVsQuote = (0, viem_1.formatUnits)(price1, token0Decimals);
    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMcFixed = quoteTokenAmountTotal.times(lpTokenRatio);
    // Amount of token in the LP that are staked in the MC
    const tokenAmountMcFixed = tokenAmountTotal.times(lpTokenRatio);
    const quoteTokenAmountMcFixedByTokenAmount = tokenAmountMcFixed.times(bigNumber_1.BIG_ONE.div(tokenPriceVsQuote));
    const lpTotalInQuoteToken = quoteTokenAmountMcFixed.plus(quoteTokenAmountMcFixedByTokenAmount);
    return {
        tokenAmountTotal: tokenAmountTotal.toString(),
        quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
        lpTotalSupply: lpTotalSupply.toString(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
        tokenPriceVsQuote,
    };
};
const formatClassicFarmResponse = (farmData) => {
    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply] = farmData;
    return {
        tokenBalanceLP: new bignumber_js_1.default(tokenBalanceLP.toString()),
        quoteTokenBalanceLP: new bignumber_js_1.default(quoteTokenBalanceLP.toString()),
        lpTokenBalanceMC: new bignumber_js_1.default(lpTokenBalanceMC.toString()),
        lpTotalSupply: new bignumber_js_1.default(lpTotalSupply.toString()),
    };
};
const getFarmAllocation = ({ allocPoint, isRegular, totalRegularAllocPoint, totalSpecialAllocPoint, }) => {
    const _allocPoint = allocPoint ? new bignumber_js_1.default(allocPoint.toString()) : bigNumber_1.BIG_ZERO;
    const totalAlloc = isRegular ? totalRegularAllocPoint : totalSpecialAllocPoint;
    const poolWeight = !!totalAlloc && !!_allocPoint ? _allocPoint.div(totalAlloc.toString()) : bigNumber_1.BIG_ZERO;
    return {
        poolWeight: poolWeight.toString(),
        multiplier: !_allocPoint.isZero() ? `${+_allocPoint.div(10).toString()}X` : `0X`,
    };
};
const getClassicFarmsDynamicData = ({ lpTokenBalanceMC, lpTotalSupply, quoteTokenBalanceLP, tokenBalanceLP, token0Decimals, token1Decimals, }) => {
    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = (0, exports.getTokenAmount)(tokenBalanceLP, token0Decimals);
    const quoteTokenAmountTotal = (0, exports.getTokenAmount)(quoteTokenBalanceLP, token1Decimals);
    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.div(lpTotalSupply) : bigNumber_1.BIG_ZERO;
    // // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMcFixed = quoteTokenAmountTotal.times(lpTokenRatio);
    // // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = quoteTokenAmountMcFixed.times(bigNumber_1.BIG_TWO);
    return {
        tokenAmountTotal: tokenAmountTotal.toString(),
        quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
        lpTotalSupply: lpTotalSupply.toString(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
        tokenPriceVsQuote: !quoteTokenAmountTotal.isZero() && !tokenAmountTotal.isZero()
            ? quoteTokenAmountTotal.div(tokenAmountTotal).toString()
            : bigNumber_1.BIG_ZERO.toString(),
        lpTokenStakedAmount: lpTokenBalanceMC.toString(),
    };
};
