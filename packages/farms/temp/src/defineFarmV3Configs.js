"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFarmV3Configs = defineFarmV3Configs;
exports.defineFarmV3ConfigsFromUniversalFarm = defineFarmV3ConfigsFromUniversalFarm;
const sdk_1 = require("@cometswap/sdk");
const tokens_1 = require("@cometswap/tokens");
const common_1 = require("../constants/common");
function sortFarmLP(token0, token1) {
    const commonTokens = common_1.priceHelperTokens[token0.chainId];
    if (commonTokens) {
        const commonTokensList = [
            sdk_1.WNATIVE[token0.chainId],
            ...commonTokens.list,
            tokens_1.COMET[token0.chainId] ? tokens_1.COMET[token0.chainId] : undefined,
        ].filter(Boolean);
        const someToken0 = commonTokensList.some((token) => token.equals(token0));
        const someToken1 = commonTokensList.some((token) => token.equals(token1));
        if (someToken0 && someToken1) {
            return commonTokensList.indexOf(token0) > commonTokensList.indexOf(token1) ? [token0, token1] : [token1, token0];
        }
        if (someToken0) {
            return [token1, token0];
        }
        if (someToken1) {
            return [token0, token1];
        }
    }
    return [token0, token1];
}
function defineFarmV3Configs(farmConfig) {
    return farmConfig.map((config) => {
        const [token, quoteToken] = sortFarmLP(config.token0, config.token1);
        const unwrappedToken0 = (0, tokens_1.unwrappedToken)(token);
        const unwrappedToken1 = (0, tokens_1.unwrappedToken)(quoteToken);
        if (!unwrappedToken0 || !unwrappedToken1) {
            throw new Error(`Invalid farm config token0: ${token.address} or token1: ${quoteToken.address}`);
        }
        return {
            ...config,
            token,
            quoteToken,
            lpSymbol: `${unwrappedToken0.symbol}-${unwrappedToken1.symbol} LP`,
        };
    });
}
function defineFarmV3ConfigsFromUniversalFarm(farms) {
    return farms
        .filter((f) => !!f.pid)
        .map((farm) => {
        const [token, quoteToken] = sortFarmLP(farm.token0, farm.token1);
        const unwrappedToken0 = (0, tokens_1.unwrappedToken)(token);
        const unwrappedToken1 = (0, tokens_1.unwrappedToken)(quoteToken);
        if (!unwrappedToken0 || !unwrappedToken1) {
            throw new Error(`Invalid farm config token0: ${token.address} or token1: ${quoteToken.address}`);
        }
        const f = {
            pid: farm.pid,
            lpSymbol: `${unwrappedToken0.symbol}-${unwrappedToken1.symbol} LP`,
            lpAddress: farm.lpAddress,
            token,
            quoteToken,
            feeAmount: farm.feeAmount,
            token0: farm.token0,
            token1: farm.token1,
        };
        if (farm.chainId === 56 && (farm.pid === 46 || farm.pid === 47)) {
            f.isCommunity = true;
        }
        return f;
    });
}
