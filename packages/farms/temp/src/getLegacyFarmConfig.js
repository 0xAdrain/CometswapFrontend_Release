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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegacyFarmConfig = getLegacyFarmConfig;
const chains_1 = require("@cometswap/chains");
const stable_swap_sdk_1 = require("@cometswap/stable-swap-sdk");
const const_1 = require("./const");
const fetchUniversalFarms_1 = require("./fetchUniversalFarms");
/**
 * @deprecated only used for legacy farms
 */
async function getLegacyFarmConfig(chainId) {
    if (chainId && const_1.supportedChainIdV4.includes(chainId)) {
        const chainName = (0, chains_1.getChainName)(chainId);
        try {
            const config = await Promise.resolve(`${`./farms/${chainName}.ts`}`).then(s => __importStar(require(s)));
            let universalConfig = await (0, fetchUniversalFarms_1.fetchUniversalFarms)(chainId);
            const stablePools = chainId ? await (0, stable_swap_sdk_1.getStableSwapPools)(chainId) : [];
            // eslint-disable-next-line prefer-destructuring
            const legacyFarmConfig = config.legacyFarmConfig;
            if (legacyFarmConfig && legacyFarmConfig.length > 0) {
                universalConfig = universalConfig.filter((f) => {
                    return (!!f.pid &&
                        !legacyFarmConfig.some((legacy) => legacy.lpAddress?.toLowerCase() === f.lpAddress?.toLowerCase()));
                });
            }
            const transformedFarmConfig = universalConfig
                ?.filter((f) => f.pid && (f.protocol === 'v2' || f.protocol === 'stable'))
                ?.map((farm) => {
                const stablePair = farm.protocol === 'stable'
                    ? stablePools.find((s) => s.lpAddress?.toLowerCase() === farm.lpAddress?.toLowerCase())
                    : undefined;
                const bveCometWrapperAddress = 'bveCometWrapperAddress' in farm ? farm.bveCometWrapperAddress : undefined;
                return {
                    pid: farm.pid ?? 0,
                    lpAddress: farm.lpAddress,
                    lpSymbol: `${farm.token0.symbol}-${farm.token1.symbol}`,
                    token: farm.token0.serialize,
                    quoteToken: farm.token1.serialize,
                    ...{
                        ...(stablePair && {
                            stableSwapAddress: stablePair.stableSwapAddress,
                            infoStableSwapAddress: stablePair.infoStableSwapAddress,
                            stableLpFee: stablePair.stableLpFee,
                            stableLpFeeRateOfTotalFee: stablePair.stableLpFeeRateOfTotalFee,
                        }),
                        ...(bveCometWrapperAddress && { bveCometWrapperAddress }),
                    },
                };
            });
            return legacyFarmConfig.concat(transformedFarmConfig);
        }
        catch (error) {
            console.error('Cannot get farm config', error, chainId, chainName);
            return [];
        }
    }
    return [];
}
