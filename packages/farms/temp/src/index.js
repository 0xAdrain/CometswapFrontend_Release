"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bveCometFarmBoosterveCometABI = exports.masterChefV3Addresses = exports.fetchTokenUSDValues = exports.fetchCommonTokenUSDValue = exports.FARM_AUCTION_HOSTING_IN_SECONDS = exports.supportedChainIdV4 = exports.supportedChainIdV3 = exports.supportedChainIdV2 = exports.supportedChainId = exports.bveCometSupportedChainId = void 0;
exports.createFarmFetcher = createFarmFetcher;
exports.createFarmFetcherV3 = createFarmFetcherV3;
const chains_1 = require("@cometswap/chains");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const viem_1 = require("viem");
const const_1 = require("./const");
Object.defineProperty(exports, "bveCometSupportedChainId", { enumerable: true, get: function () { return const_1.bveCometSupportedChainId; } });
Object.defineProperty(exports, "masterChefV3Addresses", { enumerable: true, get: function () { return const_1.masterChefV3Addresses; } });
Object.defineProperty(exports, "supportedChainId", { enumerable: true, get: function () { return const_1.supportedChainId; } });
Object.defineProperty(exports, "supportedChainIdV2", { enumerable: true, get: function () { return const_1.supportedChainIdV2; } });
Object.defineProperty(exports, "supportedChainIdV3", { enumerable: true, get: function () { return const_1.supportedChainIdV3; } });
Object.defineProperty(exports, "supportedChainIdV4", { enumerable: true, get: function () { return const_1.supportedChainIdV4; } });
const fetchFarmsV3_1 = require("./fetchFarmsV3");
Object.defineProperty(exports, "fetchCommonTokenUSDValue", { enumerable: true, get: function () { return fetchFarmsV3_1.fetchCommonTokenUSDValue; } });
Object.defineProperty(exports, "fetchTokenUSDValues", { enumerable: true, get: function () { return fetchFarmsV3_1.fetchTokenUSDValues; } });
const fetchFarmsV2_1 = require("./v2/fetchFarmsV2");
function createFarmFetcher(provider) {
    const fetchFarms = async (params) => {
        const { isTestnet, farms, chainId } = params;
        const masterChefAddress = isTestnet ? const_1.masterChefAddresses[chains_1.ChainId.BSC_TESTNET] : const_1.masterChefAddresses[chains_1.ChainId.BSC];
        const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } = await (0, fetchFarmsV2_1.fetchMasterChefV2Data)({
            isTestnet,
            provider,
            masterChefAddress,
        });
        const regularveCometPerBlock = (0, viem_1.formatEther)(cakePerBlock);
        const farmsWithPrice = await (0, fetchFarmsV2_1.farmV2FetchFarms)({
            provider,
            masterChefAddress,
            isTestnet,
            chainId,
            farms: farms.filter((f) => !f.pid || poolLength > f.pid),
            totalRegularAllocPoint,
            totalSpecialAllocPoint,
        });
        return {
            farmsWithPrice,
            poolLength: Number(poolLength),
            regularveCometPerBlock: +regularveCometPerBlock,
            totalRegularAllocPoint: totalRegularAllocPoint.toString(),
        };
    };
    return {
        fetchFarms,
        isChainSupported: (chainId) => const_1.supportedChainIdV2.includes(chainId),
        supportedChainId: const_1.supportedChainIdV2,
        isTestnet: (chainId) => ![chains_1.ChainId.BSC, chains_1.ChainId.ETHEREUM].includes(chainId),
    };
}
function createFarmFetcherV3(provider) {
    const fetchFarms = async ({ farms, chainId, commonPrice, }) => {
        const masterChefAddress = const_1.masterChefV3Addresses[chainId];
        if (!masterChefAddress || !provider) {
            throw new Error('Unsupported chain');
        }
        try {
            const { poolLength, totalAllocPoint, latestPeriodveCometPerSecond } = await (0, fetchFarmsV3_1.fetchMasterChefV3Data)({
                provider,
                masterChefAddress,
                chainId,
            });
            const cakePerSecond = new bignumber_js_1.default(latestPeriodveCometPerSecond.toString()).div(1e18).div(1e12).toString();
            const farmsWithPrice = await (0, fetchFarmsV3_1.farmV3FetchFarms)({
                farms,
                chainId,
                provider,
                masterChefAddress,
                totalAllocPoint,
                commonPrice,
            });
            return {
                chainId,
                poolLength: Number(poolLength),
                farmsWithPrice,
                cakePerSecond,
                totalAllocPoint: totalAllocPoint.toString(),
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    };
    const getveCometAprAndTVL = (farm, lpTVL, cometPrice, cakePerSecond, boosterLiquidityX) => {
        const [token0Price, token1Price] = farm.token.sortsBefore(farm.quoteToken)
            ? [farm.tokenPriceBusd, farm.quoteTokenPriceBusd]
            : [farm.quoteTokenPriceBusd, farm.tokenPriceBusd];
        const tvl = new bignumber_js_1.default(token0Price).times(lpTVL.token0).plus(new bignumber_js_1.default(token1Price).times(lpTVL.token1));
        const cakeApr = (0, fetchFarmsV3_1.getveCometApr)(farm.poolWeight, tvl.times(boosterLiquidityX ?? 1), cometPrice, cakePerSecond);
        return {
            activeTvlUSD: tvl.toString(),
            activeTvlUSDUpdatedAt: lpTVL.updatedAt,
            cakeApr,
        };
    };
    return {
        fetchFarms,
        getveCometAprAndTVL,
        isChainSupported: (chainId) => const_1.supportedChainIdV3.includes(chainId),
        supportedChainId: const_1.supportedChainIdV3,
        isTestnet: (chainId) => ![chains_1.ChainId.BSC, chains_1.ChainId.ETHEREUM].includes(chainId),
    };
}
__exportStar(require("./apr"), exports);
var const_2 = require("./const");
Object.defineProperty(exports, "FARM_AUCTION_HOSTING_IN_SECONDS", { enumerable: true, get: function () { return const_2.FARM_AUCTION_HOSTING_IN_SECONDS; } });
__exportStar(require("./defineFarmV3Configs"), exports);
__exportStar(require("./farms"), exports);
__exportStar(require("./fetchUniversalFarms"), exports);
__exportStar(require("./getLegacyFarmConfig"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./v2/deserializeFarm"), exports);
__exportStar(require("./v2/deserializeFarmUserData"), exports);
__exportStar(require("./v2/farmsPriceHelpers"), exports);
__exportStar(require("./v2/filterFarmsByQuery"), exports);
// Export ABIs
var bveCometFarmBoosterveComet_1 = require("../constants/v3/abi/bveCometFarmBoosterveComet");
Object.defineProperty(exports, "bveCometFarmBoosterveCometABI", { enumerable: true, get: function () { return bveCometFarmBoosterveComet_1.bveCometFarmBoosterveCometABI; } });
