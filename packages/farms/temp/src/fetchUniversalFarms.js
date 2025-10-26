"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUniversalFarms = void 0;
const sdk_1 = require("@cometswap/sdk");
const endpoint_1 = require("../config/endpoint");
const farmCache = {};
const fetchUniversalFarms = async (chainId, protocol) => {
    const cacheKey = `${chainId}-${protocol || 'all'}`;
    // Return cached data if it exists
    if (farmCache[cacheKey]) {
        return farmCache[cacheKey];
    }
    try {
        const params = { chainId, ...(protocol && { protocol }) };
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const response = await fetch(`${endpoint_1.FARMS_API}?${queryString}`, {
            signal: AbortSignal.timeout(3000),
        });
        const result = await response.json();
        const newData = result.map((p) => ({
            ...p,
            token0: new sdk_1.ERC20Token(p.token0.chainId, p.token0.address, p.token0.decimals, p.token0.symbol, p.token0.name, p.token0.projectLink),
            token1: new sdk_1.ERC20Token(p.token1.chainId, p.token1.address, p.token1.decimals, p.token1.symbol, p.token1.name, p.token1.projectLink),
        }));
        // Cache the result before returning it
        farmCache[cacheKey] = newData;
        return newData;
    }
    catch (error) {
        return [];
    }
};
exports.fetchUniversalFarms = fetchUniversalFarms;
