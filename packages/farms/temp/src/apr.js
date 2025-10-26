"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmApr = getFarmApr;
exports.getPositionFarmApr = getPositionFarmApr;
exports.getPositionFarmAprFactor = getPositionFarmAprFactor;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const formatFractions_1 = require("@cometswap/utils/formatFractions");
const sdk_1 = require("@cometswap/sdk");
const SECONDS_FOR_YEAR = 365 * 60 * 60 * 24;
const isValid = (num) => {
    const bigNumber = new bignumber_js_1.default(num);
    return bigNumber.isFinite() && bigNumber.isPositive();
};
const formatNumber = (bn, precision) => {
    return (0, formatFractions_1.formatFraction)((0, formatFractions_1.parseNumberToFraction)(bn.toNumber(), precision), precision);
};
function getFarmApr({ poolWeight, tvlUsd, cakePriceUsd, cakePerSecond, precision = 6 }) {
    if (!isValid(poolWeight) || !isValid(tvlUsd) || !isValid(cakePriceUsd) || !isValid(cakePerSecond)) {
        return '0';
    }
    const cakeRewardPerYear = new bignumber_js_1.default(cakePerSecond).times(SECONDS_FOR_YEAR);
    const farmApr = new bignumber_js_1.default(poolWeight).times(cakeRewardPerYear).times(cakePriceUsd).div(tvlUsd).times(100);
    if (farmApr.isZero()) {
        return '0';
    }
    return formatNumber(farmApr, precision);
}
function getPositionFarmApr({ poolWeight, positionTvlUsd, cakePriceUsd, cakePerSecond, liquidity, totalStakedLiquidity, precision = 6, }) {
    const aprFactor = getPositionFarmAprFactor({
        poolWeight,
        cakePriceUsd,
        cakePerSecond,
        liquidity,
        totalStakedLiquidity,
    });
    if (!isValid(aprFactor) || !isValid(positionTvlUsd)) {
        return '0';
    }
    const positionApr = aprFactor.times(liquidity.toString()).div(positionTvlUsd);
    return formatNumber(positionApr, precision);
}
function getPositionFarmAprFactor({ poolWeight, cakePriceUsd, cakePerSecond, liquidity, totalStakedLiquidity, }) {
    if (!isValid(poolWeight) ||
        !isValid(cakePriceUsd) ||
        !isValid(cakePerSecond) ||
        BigInt(liquidity) === sdk_1.ZERO ||
        BigInt(totalStakedLiquidity) === sdk_1.ZERO) {
        return new bignumber_js_1.default(0);
    }
    const cakeRewardPerYear = new bignumber_js_1.default(cakePerSecond).times(SECONDS_FOR_YEAR);
    const aprFactor = new bignumber_js_1.default(poolWeight)
        .times(cakeRewardPerYear)
        .times(cakePriceUsd)
        .div((BigInt(liquidity) + BigInt(totalStakedLiquidity)).toString())
        .times(100);
    return aprFactor;
}
