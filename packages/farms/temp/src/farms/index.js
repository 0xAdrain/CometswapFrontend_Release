"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIVERSAL_FARMS_WITH_TESTNET = exports.fetchAllUniversalFarmsMap = exports.fetchAllUniversalFarms = void 0;
const chains_1 = require("@cometswap/chains");
const set_1 = __importDefault(require("lodash/set"));
const fetchUniversalFarms_1 = require("../fetchUniversalFarms");
const bscTestnet_1 = require("./bscTestnet");
const polygonZkEVMTestnet_1 = require("./polygonZkEVMTestnet");
const zkSyncTestnet_1 = require("./zkSyncTestnet");
const utils_1 = require("../utils");
const chainIds = [
    chains_1.ChainId.BSC,
    chains_1.ChainId.ETHEREUM,
    chains_1.ChainId.POLYGON_ZKEVM,
    chains_1.ChainId.ZKSYNC,
    chains_1.ChainId.ARBITRUM_ONE,
    chains_1.ChainId.LINEA,
    chains_1.ChainId.BASE,
    chains_1.ChainId.OPBNB,
];
const fetchAllUniversalFarms = async () => {
    try {
        const farmPromises = chainIds.map((chainId) => (0, fetchUniversalFarms_1.fetchUniversalFarms)(chainId));
        const allFarms = await Promise.all(farmPromises);
        const combinedFarms = allFarms.flat();
        return combinedFarms;
    }
    catch (error) {
        console.error('Failed to fetch universal farms:', error);
        return [];
    }
};
exports.fetchAllUniversalFarms = fetchAllUniversalFarms;
const fetchAllUniversalFarmsMap = async () => {
    try {
        const farmConfig = await (0, exports.fetchAllUniversalFarms)();
        return farmConfig.reduce((acc, farm) => {
            (0, set_1.default)(acc, (0, utils_1.getFarmConfigKey)(farm), farm);
            return acc;
        }, {});
    }
    catch (error) {
        console.error('Failed to fetch universal farms map:', error);
        return {};
    }
};
exports.fetchAllUniversalFarmsMap = fetchAllUniversalFarmsMap;
exports.UNIVERSAL_FARMS_WITH_TESTNET = [
    ...bscTestnet_1.bscTestnetFarmConfig,
    ...polygonZkEVMTestnet_1.polygonZkEVMTestnetFarmConfig,
    ...zkSyncTestnet_1.zkSyncTestnetFarmConfig,
];
