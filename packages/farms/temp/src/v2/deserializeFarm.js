"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeFarm = void 0;
const token_lists_1 = require("@cometswap/token-lists");
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const isUndefinedOrNull_1 = __importDefault(require("@cometswap/utils/isUndefinedOrNull"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const dayjs_1 = __importDefault(require("dayjs"));
const const_1 = require("../const");
const deserializeFarmUserData_1 = require("./deserializeFarmUserData");
const deserializeFarm = (farm, auctionHostingInSeconds = const_1.FARM_AUCTION_HOSTING_IN_SECONDS) => {
    const { lpAddress, lpRewardsApr, lpSymbol, pid, vaultPid, dual, multiplier, isCommunity, auctionHostingStartSeconds, quoteTokenPriceBusd, tokenPriceBusd, boosted, infoStableSwapAddress, stableSwapAddress, stableLpFee, stableLpFeeRateOfTotalFee, bveCometWrapperAddress, } = farm;
    const auctionHostingStartDate = !(0, isUndefinedOrNull_1.default)(auctionHostingStartSeconds)
        ? new Date(auctionHostingStartSeconds * 1000)
        : null;
    const auctionHostingEndDate = auctionHostingStartDate
        ? (0, dayjs_1.default)(auctionHostingStartDate).add(auctionHostingInSeconds, 'seconds').toDate()
        : null;
    const now = Date.now();
    const isFarmCommunity = isCommunity ||
        !!(auctionHostingStartDate &&
            auctionHostingEndDate &&
            auctionHostingStartDate.getTime() < now &&
            auctionHostingEndDate.getTime() > now);
    const bveCometUserData = (0, deserializeFarmUserData_1.deserializeFarmBveCometUserData)(farm);
    const bveCometPublicData = (0, deserializeFarmUserData_1.deserializeFarmBveCometPublicData)(farm);
    return {
        bveCometWrapperAddress,
        lpAddress,
        lpRewardsApr,
        lpSymbol,
        pid,
        vaultPid,
        ...(dual && {
            dual: {
                ...dual,
                token: (0, token_lists_1.deserializeToken)(dual?.token),
            },
        }),
        multiplier,
        isCommunity: isFarmCommunity,
        auctionHostingEndDate: auctionHostingEndDate?.toJSON(),
        quoteTokenPriceBusd,
        tokenPriceBusd,
        token: (0, token_lists_1.deserializeToken)(farm.token),
        quoteToken: (0, token_lists_1.deserializeToken)(farm.quoteToken),
        userData: (0, deserializeFarmUserData_1.deserializeFarmUserData)(farm),
        bveCometUserData,
        tokenAmountTotal: farm.tokenAmountTotal ? new bignumber_js_1.default(farm.tokenAmountTotal) : bigNumber_1.BIG_ZERO,
        quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new bignumber_js_1.default(farm.quoteTokenAmountTotal) : bigNumber_1.BIG_ZERO,
        lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new bignumber_js_1.default(farm.lpTotalInQuoteToken) : bigNumber_1.BIG_ZERO,
        lpTotalSupply: farm.lpTotalSupply ? new bignumber_js_1.default(farm.lpTotalSupply) : bigNumber_1.BIG_ZERO,
        lpTokenPrice: farm.lpTokenPrice ? new bignumber_js_1.default(farm.lpTokenPrice) : bigNumber_1.BIG_ZERO,
        tokenPriceVsQuote: farm.tokenPriceVsQuote ? new bignumber_js_1.default(farm.tokenPriceVsQuote) : bigNumber_1.BIG_ZERO,
        poolWeight: farm.poolWeight ? new bignumber_js_1.default(farm.poolWeight) : bigNumber_1.BIG_ZERO,
        boosted,
        isStable: Boolean(infoStableSwapAddress),
        stableSwapAddress,
        stableLpFee,
        stableLpFeeRateOfTotalFee,
        lpTokenStakedAmount: farm.lpTokenStakedAmount ? new bignumber_js_1.default(farm.lpTokenStakedAmount) : bigNumber_1.BIG_ZERO,
        bveCometPublicData,
    };
};
exports.deserializeFarm = deserializeFarm;
