"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmConfigKey = void 0;
exports.isActiveV3Farm = isActiveV3Farm;
exports.formatUniversalFarmToSerializedFarm = formatUniversalFarmToSerializedFarm;
const stable_swap_sdk_1 = require("@cometswap/stable-swap-sdk");
function isActiveV3Farm(farm, poolLength) {
    return farm.pid !== 0 && farm.multiplier !== '0X' && poolLength && poolLength >= farm.pid;
}
async function formatUniversalFarmToSerializedFarm(farms) {
    const formattedFarms = await Promise.all(farms.map(async (farm) => {
        switch (farm.protocol) {
            case 'stable':
                return formatStableUniversalFarmToSerializedFarm(farm);
            case 'v2':
                return formatV2UniversalFarmToSerializedFarm(farm);
            case 'v3':
                return formatV3UniversalFarmToSerializedFarm(farm);
            default:
                return undefined;
        }
    }));
    return formattedFarms.filter((farm) => farm !== undefined);
}
const formatStableUniversalFarmToSerializedFarm = async (farm) => {
    const { chainId, lpAddress, pid, token0, token1, stableSwapAddress, bveCometWrapperAddress } = farm;
    try {
        const stablePools = await (0, stable_swap_sdk_1.getStableSwapPools)(chainId);
        const stablePair = stablePools.find((pair) => pair.stableSwapAddress?.toLowerCase() === stableSwapAddress?.toLowerCase());
        if (!stablePair) {
            console.warn(`Could not find stable pair for farm with stableSwapAddress ${stableSwapAddress}`);
            return undefined;
        }
        return {
            pid,
            lpAddress,
            lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
            token: token0,
            quoteToken: token1,
            stableSwapAddress,
            stableLpFee: stablePair.stableLpFee,
            stableLpFeeRateOfTotalFee: stablePair.stableLpFeeRateOfTotalFee,
            infoStableSwapAddress: stablePair.infoStableSwapAddress,
            bveCometWrapperAddress,
            chainId,
            version: 2,
        };
    }
    catch (error) {
        console.error('Failed to fetch stable swap pools:', error);
        return undefined;
    }
};
const formatV2UniversalFarmToSerializedFarm = (farm) => {
    const { chainId, pid, bveCometWrapperAddress, lpAddress, token0, token1 } = farm;
    return {
        pid,
        lpAddress,
        lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
        bveCometWrapperAddress,
        token: token0,
        quoteToken: token1,
        chainId,
        version: 2,
    };
};
const formatV3UniversalFarmToSerializedFarm = (farm) => {
    const { chainId, pid, lpAddress, token0, token1, feeAmount } = farm;
    return {
        pid,
        lpAddress,
        lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
        token0,
        token1,
        token: token0,
        quoteToken: token1,
        feeAmount,
        chainId,
        version: 3,
    };
};
const getFarmConfigKey = (farm) => {
    return `${farm.chainId}:${farm.lpAddress.toLowerCase()}`;
};
exports.getFarmConfigKey = getFarmConfigKey;
