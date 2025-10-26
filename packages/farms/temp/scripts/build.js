"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveList = void 0;
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const chains_1 = require("@cometswap/chains");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _1_1 = __importDefault(require("../constants/priceHelperLps/1"));
const _56_1 = __importDefault(require("../constants/priceHelperLps/56"));
const fetchUniversalFarms_1 = require("../src/fetchUniversalFarms");
const chains = [
    [1, (0, fetchUniversalFarms_1.fetchUniversalFarms)(chains_1.ChainId.ETHEREUM), _1_1.default],
    [56, (0, fetchUniversalFarms_1.fetchUniversalFarms)(chains_1.ChainId.BSC), _56_1.default],
];
const saveList = async () => {
    console.info('save farm config...');
    try {
        fs_1.default.mkdirSync(`${path_1.default.resolve()}/lists`);
        fs_1.default.mkdirSync(`${path_1.default.resolve()}/lists/priceHelperLps`);
    }
    catch (error) {
        //
    }
    for (const [chain, farmPromise, lpHelper] of chains) {
        console.info('Starting build farm config', chain);
        const farm = await farmPromise;
        const farmListPath = `${path_1.default.resolve()}/lists/${chain}.json`;
        const stringifiedList = JSON.stringify(farm, null, 2);
        fs_1.default.writeFileSync(farmListPath, stringifiedList);
        console.info('Farm list saved to ', farmListPath);
        const lpPriceHelperListPath = `${path_1.default.resolve()}/lists/priceHelperLps/${chain}.json`;
        const stringifiedHelperList = JSON.stringify(lpHelper, null, 2);
        fs_1.default.writeFileSync(lpPriceHelperListPath, stringifiedHelperList);
        console.info('Lp list saved to ', lpPriceHelperListPath);
    }
};
exports.saveList = saveList;
(0, exports.saveList)();
