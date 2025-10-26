"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossFarmingVaultAddresses = exports.masterChefV3Addresses = exports.masterChefAddresses = exports.FARM_AUCTION_HOSTING_IN_SECONDS = exports.bveCometSupportedChainId = exports.supportedChainId = exports.supportedChainIdV3 = exports.supportedChainIdV2 = exports.supportedChainIdV4 = void 0;
const chains_1 = require("@cometswap/chains");
const uniq_1 = __importDefault(require("lodash/uniq"));
// @todo remove all other v2/v3 and type definitions
exports.supportedChainIdV4 = [
    chains_1.ChainId.BSC,
    chains_1.ChainId.ETHEREUM,
    chains_1.ChainId.BASE,
    chains_1.ChainId.OPBNB,
    chains_1.ChainId.ZKSYNC,
    chains_1.ChainId.POLYGON_ZKEVM,
    chains_1.ChainId.LINEA,
    chains_1.ChainId.ARBITRUM_ONE,
];
exports.supportedChainIdV2 = [
    chains_1.ChainId.GOERLI,
    chains_1.ChainId.BSC,
    chains_1.ChainId.BSC_TESTNET,
    chains_1.ChainId.ETHEREUM,
    chains_1.ChainId.ARBITRUM_ONE,
    chains_1.ChainId.XLAYER_TESTNET,
];
exports.supportedChainIdV3 = [
    // ChainId.GOERLI,
    chains_1.ChainId.BSC,
    chains_1.ChainId.BSC_TESTNET,
    chains_1.ChainId.ETHEREUM,
    chains_1.ChainId.ZKSYNC_TESTNET,
    chains_1.ChainId.POLYGON_ZKEVM_TESTNET,
    chains_1.ChainId.POLYGON_ZKEVM,
    chains_1.ChainId.ZKSYNC,
    chains_1.ChainId.ARBITRUM_ONE,
    chains_1.ChainId.LINEA,
    chains_1.ChainId.BASE,
    chains_1.ChainId.OPBNB,
    chains_1.ChainId.OPBNB_TESTNET,
    chains_1.ChainId.XLAYER_TESTNET,
];
exports.supportedChainId = (0, uniq_1.default)([...exports.supportedChainIdV2, ...exports.supportedChainIdV3]);
exports.bveCometSupportedChainId = [
    chains_1.ChainId.BSC,
    chains_1.ChainId.ARBITRUM_ONE,
    chains_1.ChainId.ETHEREUM,
    chains_1.ChainId.ZKSYNC,
    chains_1.ChainId.BASE,
];
exports.FARM_AUCTION_HOSTING_IN_SECONDS = 691200;
exports.masterChefAddresses = {
    [chains_1.ChainId.BSC_TESTNET]: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
    [chains_1.ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
};
exports.masterChefV3Addresses = {
    [chains_1.ChainId.ETHEREUM]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
    // [ChainId.GOERLI]: '0x864ED564875BdDD6F421e226494a0E7c071C06f8',
    [chains_1.ChainId.BSC]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
    [chains_1.ChainId.BSC_TESTNET]: '0x4c650FB471fe4e0f476fD3437C3411B1122c4e3B',
    [chains_1.ChainId.ZKSYNC_TESTNET]: '0x3c6Aa61f72932aD5D7C917737367be32D5509e6f',
    [chains_1.ChainId.POLYGON_ZKEVM_TESTNET]: '0xb66b07590B30d4E6E22e45Ddc83B06Bb018A7B44',
    [chains_1.ChainId.POLYGON_ZKEVM]: '0xE9c7f3196Ab8C09F6616365E8873DaEb207C0391',
    [chains_1.ChainId.ZKSYNC]: '0x4c615E78c5fCA1Ad31e4d66eb0D8688d84307463',
    [chains_1.ChainId.ARBITRUM_ONE]: '0x5e09ACf80C0296740eC5d6F643005a4ef8DaA694',
    [chains_1.ChainId.LINEA]: '0x22E2f236065B780FA33EC8C4E58b99ebc8B55c57',
    [chains_1.ChainId.BASE]: '0xC6A2Db661D5a5690172d8eB0a7DEA2d3008665A3',
    [chains_1.ChainId.OPBNB]: '0x05ddEDd07C51739d2aE21F6A9d97a8d69C2C3aaA',
    [chains_1.ChainId.OPBNB_TESTNET]: '0x236e713bFF45adb30e25D1c29A887aBCb0Ea7E21',
    [chains_1.ChainId.XLAYER_TESTNET]: '0x77C98E425fFDdD8E0E1F9FFAbA74D60a722c1F81', // MasterChefV3 deployed address
};
exports.crossFarmingVaultAddresses = {
    [chains_1.ChainId.ETHEREUM]: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
    [chains_1.ChainId.GOERLI]: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
};
