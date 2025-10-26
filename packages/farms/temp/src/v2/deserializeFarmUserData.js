"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeFarmBveCometPublicData = exports.deserializeFarmBveCometUserData = exports.deserializeFarmUserData = void 0;
const tokens_1 = require("@cometswap/tokens");
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const formatBalance_1 = require("@cometswap/utils/formatBalance");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const deserializeFarmUserData = (farm) => {
    return {
        allowance: farm?.userData ? new bignumber_js_1.default(farm.userData.allowance) : bigNumber_1.BIG_ZERO,
        tokenBalance: farm?.userData ? new bignumber_js_1.default(farm.userData.tokenBalance) : bigNumber_1.BIG_ZERO,
        stakedBalance: farm?.userData ? new bignumber_js_1.default(farm.userData.stakedBalance) : bigNumber_1.BIG_ZERO,
        earnings: farm?.userData ? new bignumber_js_1.default(farm.userData.earnings) : bigNumber_1.BIG_ZERO,
        proxy: {
            allowance: farm?.userData?.proxy ? new bignumber_js_1.default(farm?.userData?.proxy.allowance) : bigNumber_1.BIG_ZERO,
            tokenBalance: farm?.userData?.proxy ? new bignumber_js_1.default(farm?.userData?.proxy.tokenBalance) : bigNumber_1.BIG_ZERO,
            stakedBalance: farm?.userData?.proxy ? new bignumber_js_1.default(farm?.userData?.proxy.stakedBalance) : bigNumber_1.BIG_ZERO,
            earnings: farm?.userData?.proxy ? new bignumber_js_1.default(farm?.userData?.proxy.earnings) : bigNumber_1.BIG_ZERO,
        },
    };
};
exports.deserializeFarmUserData = deserializeFarmUserData;
const deserializeFarmBveCometUserData = (farm) => {
    return {
        allowance: farm?.bveCometUserData ? new bignumber_js_1.default(farm.bveCometUserData.allowance) : bigNumber_1.BIG_ZERO,
        tokenBalance: farm?.bveCometUserData ? new bignumber_js_1.default(farm.bveCometUserData.tokenBalance) : bigNumber_1.BIG_ZERO,
        stakedBalance: farm?.bveCometUserData ? new bignumber_js_1.default(farm.bveCometUserData.stakedBalance) : bigNumber_1.BIG_ZERO,
        earnings: farm?.bveCometUserData ? new bignumber_js_1.default(farm.bveCometUserData.earnings) : bigNumber_1.BIG_ZERO,
        boosterMultiplier: farm?.bveCometUserData?.boosterMultiplier ?? 1,
        boostedAmounts: farm?.bveCometUserData?.boostedAmounts ? new bignumber_js_1.default(farm.bveCometUserData.boostedAmounts) : bigNumber_1.BIG_ZERO,
        boosterContractAddress: farm?.bveCometUserData?.boosterContractAddress,
        rewardPerSecond: farm?.bveCometUserData?.rewardPerSecond
            ? (0, formatBalance_1.getBalanceAmount)(new bignumber_js_1.default(farm?.bveCometUserData?.rewardPerSecond), tokens_1.bscTestnetTokens.comet.decimals).toNumber()
            : 0,
        startTimestamp: farm?.bveCometUserData?.startTimestamp,
        endTimestamp: farm?.bveCometUserData?.endTimestamp,
    };
};
exports.deserializeFarmBveCometUserData = deserializeFarmBveCometUserData;
const deserializeFarmBveCometPublicData = (farm) => {
    // const isRewardInRange = true
    const isRewardInRange = farm?.bveCometPublicData?.startTimestamp &&
        farm?.bveCometPublicData?.endTimestamp &&
        Date.now() / 1000 >= farm.bveCometPublicData.startTimestamp &&
        Date.now() / 1000 < farm.bveCometPublicData.endTimestamp;
    return {
        allowance: farm?.bveCometPublicData ? new bignumber_js_1.default(farm.bveCometPublicData.allowance) : bigNumber_1.BIG_ZERO,
        tokenBalance: farm?.bveCometPublicData ? new bignumber_js_1.default(farm.bveCometPublicData.tokenBalance) : bigNumber_1.BIG_ZERO,
        stakedBalance: farm?.bveCometPublicData ? new bignumber_js_1.default(farm.bveCometPublicData.stakedBalance) : bigNumber_1.BIG_ZERO,
        earnings: farm?.bveCometPublicData ? new bignumber_js_1.default(farm.bveCometPublicData.earnings) : bigNumber_1.BIG_ZERO,
        boosterMultiplier: isRewardInRange ? farm?.bveCometPublicData?.boosterMultiplier ?? 1 : 1,
        boostedAmounts: farm?.bveCometPublicData?.boostedAmounts
            ? new bignumber_js_1.default(farm.bveCometPublicData.boostedAmounts)
            : bigNumber_1.BIG_ZERO,
        boosterContractAddress: farm?.bveCometPublicData?.boosterContractAddress,
        rewardPerSecond: farm?.bveCometPublicData?.rewardPerSecond && isRewardInRange
            ? (0, formatBalance_1.getBalanceAmount)(new bignumber_js_1.default(farm?.bveCometPublicData?.rewardPerSecond), tokens_1.bscTestnetTokens.comet.decimals).toNumber()
            : 0,
        startTimestamp: farm?.bveCometPublicData?.startTimestamp,
        endTimestamp: farm?.bveCometPublicData?.endTimestamp,
        isRewardInRange: Boolean(isRewardInRange),
        totalLiquidityX: farm?.bveCometPublicData?.totalLiquidityX ?? 1,
    };
};
exports.deserializeFarmBveCometPublicData = deserializeFarmBveCometPublicData;
