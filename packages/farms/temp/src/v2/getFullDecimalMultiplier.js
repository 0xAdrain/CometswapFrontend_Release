"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullDecimalMultiplier = void 0;
const bigNumber_1 = require("@cometswap/utils/bigNumber");
const memoize_1 = __importDefault(require("lodash/memoize"));
exports.getFullDecimalMultiplier = (0, memoize_1.default)((decimals) => {
    return bigNumber_1.BIG_TEN.pow(decimals);
});
