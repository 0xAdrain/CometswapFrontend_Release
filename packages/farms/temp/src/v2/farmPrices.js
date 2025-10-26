"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmsPrices = exports.getLpTokenPrice = exports.getStableLpTokenPrice = exports.getFarmQuoteTokenPrice = exports.getFarmBaseTokenPrice = void 0;
exports.getFarmLpTokenPrice = getFarmLpTokenPrice;
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const equalsIgnoreCase_1 = require("@cometswap/utils/equalsIgnoreCase");
const toNumber_1 = __importDefault(require("lodash/toNumber"));
const types_1 = require("../types");
const getFullDecimalMultiplier_1 = require("./getFullDecimalMultiplier");
// Find BUSD price for token
// either via direct calculation if farm is X-BNB or X-BUSD
// or via quoteTokenFarm which is quoteToken-BNB or quoteToken-BUSD farm
const getFarmBaseTokenPrice = (farm, quoteTokenFarm, nativePriceUSD, wNative, stable, quoteTokenInBusd) => {
    const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote);
    if (farm.quoteToken.symbol === stable) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hasTokenPriceVsQuote ? new bignumber_js_1.default(farm.tokenPriceVsQuote) : bigNumber_1.BIG_ONE;
    }
    if (farm.quoteToken.symbol === wNative) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return hasTokenPriceVsQuote ? nativePriceUSD.times(new bignumber_js_1.default(farm.tokenPriceVsQuote)) : bigNumber_1.BIG_ONE;
    }
    // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
    if (!quoteTokenFarm) {
        return bigNumber_1.BIG_ZERO;
    }
    // Possible alternative farm quoteTokens:
    // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
    // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
    // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
    // from the BNB - pBTC price, we can calculate the PNT - BUSD price
    if (quoteTokenFarm.quoteToken.symbol === wNative || quoteTokenFarm.quoteToken.symbol === stable) {
        return hasTokenPriceVsQuote && quoteTokenInBusd
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                new bignumber_js_1.default(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
            : bigNumber_1.BIG_ONE;
    }
    // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
    return bigNumber_1.BIG_ZERO;
};
exports.getFarmBaseTokenPrice = getFarmBaseTokenPrice;
const getFarmQuoteTokenPrice = (farm, quoteTokenFarm, nativePriceUSD, wNative, stable) => {
    if (farm.quoteToken.symbol === stable) {
        return bigNumber_1.BIG_ONE;
    }
    if (farm.quoteToken.symbol === wNative) {
        return nativePriceUSD;
    }
    if (!quoteTokenFarm) {
        return bigNumber_1.BIG_ZERO;
    }
    if (quoteTokenFarm.quoteToken.symbol === wNative) {
        return quoteTokenFarm.tokenPriceVsQuote ? nativePriceUSD.times(new bignumber_js_1.default(quoteTokenFarm.tokenPriceVsQuote)) : bigNumber_1.BIG_ZERO;
    }
    if (quoteTokenFarm.quoteToken.symbol === stable) {
        return quoteTokenFarm.tokenPriceVsQuote ? new bignumber_js_1.default(quoteTokenFarm.tokenPriceVsQuote) : bigNumber_1.BIG_ZERO;
    }
    return bigNumber_1.BIG_ZERO;
};
exports.getFarmQuoteTokenPrice = getFarmQuoteTokenPrice;
const getFarmFromTokenAddress = (farms, tokenAddress, preferredQuoteTokens) => {
    const farmsWithTokenSymbol = farms.filter((farm) => (0, equalsIgnoreCase_1.equalsIgnoreCase)(farm.token.address, tokenAddress));
    const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens);
    return filteredFarm;
};
const filterFarmsByQuoteToken = (farms, preferredQuoteTokens = ['BUSD', 'WBNB']) => {
    const preferredFarm = farms.find((farm) => {
        return preferredQuoteTokens.some((quoteToken) => {
            return farm.quoteToken.symbol === quoteToken;
        });
    });
    return preferredFarm || farms[0];
};
const getStableLpTokenPrice = (lpTotalSupply, tokenAmountTotal, tokenPriceBusd, quoteTokenAmountTotal, quoteTokenInBusd, decimals) => {
    if (lpTotalSupply.isZero()) {
        return bigNumber_1.BIG_ZERO;
    }
    const valueOfBaseTokenInFarm = tokenPriceBusd.times(tokenAmountTotal);
    const valueOfQuoteTokenInFarm = quoteTokenInBusd.times(quoteTokenAmountTotal);
    const liquidity = valueOfBaseTokenInFarm.plus(valueOfQuoteTokenInFarm);
    const totalLpTokens = lpTotalSupply.div((0, getFullDecimalMultiplier_1.getFullDecimalMultiplier)(decimals));
    return liquidity.div(totalLpTokens);
};
exports.getStableLpTokenPrice = getStableLpTokenPrice;
const getLpTokenPrice = (lpTotalSupply, lpTotalInQuoteToken, tokenAmountTotal, tokenPriceBusd, decimals) => {
    // LP token price
    let lpTokenPrice = bigNumber_1.BIG_ZERO;
    if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
        // Total value of base token in LP
        const valueOfBaseTokenInFarm = tokenPriceBusd.times(tokenAmountTotal);
        // Double it to get overall value in LP
        const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(bigNumber_1.BIG_TWO);
        // Divide total value of all tokens, by the number of LP tokens
        const totalLpTokens = lpTotalSupply.div((0, getFullDecimalMultiplier_1.getFullDecimalMultiplier)(decimals));
        lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
    }
    return lpTokenPrice;
};
exports.getLpTokenPrice = getLpTokenPrice;
const isNativeFarm = (farm, nativeStableLp) => {
    const isLpFound = (0, equalsIgnoreCase_1.equalsIgnoreCase)(farm.lpAddress, nativeStableLp.address);
    if (!isLpFound) {
        return ((0, equalsIgnoreCase_1.equalsIgnoreCase)(farm.token.symbol, nativeStableLp.stable) &&
            (0, equalsIgnoreCase_1.equalsIgnoreCase)(farm.quoteToken.symbol, nativeStableLp.wNative));
    }
    return true;
};
function getFarmLpTokenPrice(farm, tokenPrice, quoteTokenPrice, decimals) {
    return (0, types_1.isStableFarm)(farm)
        ? (0, exports.getStableLpTokenPrice)(new bignumber_js_1.default(farm.lpTotalSupply), new bignumber_js_1.default(farm.tokenAmountTotal), tokenPrice, new bignumber_js_1.default(farm.quoteTokenAmountTotal), quoteTokenPrice, decimals)
        : (0, exports.getLpTokenPrice)(new bignumber_js_1.default(farm.lpTotalSupply), new bignumber_js_1.default(farm.lpTotalInQuoteToken), new bignumber_js_1.default(farm.tokenAmountTotal), tokenPrice, decimals);
}
const getFarmsPrices = (farms, nativeStableLp, decimals) => {
    if (!farms || !nativeStableLp || farms.length === 0)
        return [];
    const nativeStableFarm = farms.find((farm) => isNativeFarm(farm, nativeStableLp));
    const isNativeFirst = nativeStableFarm?.token?.symbol === nativeStableLp.wNative;
    const nativePriceUSD = nativeStableFarm && (0, toNumber_1.default)(nativeStableFarm?.tokenPriceVsQuote) !== 0
        ? isNativeFirst
            ? new bignumber_js_1.default(nativeStableFarm.tokenPriceVsQuote)
            : bigNumber_1.BIG_ONE.div(new bignumber_js_1.default(nativeStableFarm.tokenPriceVsQuote))
        : bigNumber_1.BIG_ZERO;
    const farmsWithPrices = farms.map((farm) => {
        const quoteTokenFarm = getFarmFromTokenAddress(farms, farm.quoteToken.address, [
            nativeStableLp.wNative,
            nativeStableLp.stable,
        ]);
        const quoteTokenPriceBusd = (0, exports.getFarmQuoteTokenPrice)(farm, quoteTokenFarm, nativePriceUSD, nativeStableLp.wNative, nativeStableLp.stable);
        const tokenPriceBusd = (0, exports.getFarmBaseTokenPrice)(farm, quoteTokenFarm, nativePriceUSD, nativeStableLp.wNative, nativeStableLp.stable, quoteTokenPriceBusd);
        const lpTokenPrice = getFarmLpTokenPrice(farm, tokenPriceBusd, quoteTokenPriceBusd, decimals);
        return {
            ...farm,
            tokenPriceBusd: tokenPriceBusd.toString(),
            quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
            lpTokenPrice: lpTokenPrice.toString(),
        };
    });
    return farmsWithPrices;
};
exports.getFarmsPrices = getFarmsPrices;
