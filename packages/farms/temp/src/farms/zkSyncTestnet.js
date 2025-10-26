"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyFarmConfig = exports.legacyV3ZkSyncTestnetFarmConfig = exports.zkSyncTestnetFarmConfig = void 0;
const chains_1 = require("@cometswap/chains");
const tokens_1 = require("@cometswap/tokens");
const v3_sdk_1 = require("@cometswap/v3-sdk");
const defineFarmV3Configs_1 = require("../defineFarmV3Configs");
const types_1 = require("../types");
const pinnedFarmConfig = [];
exports.zkSyncTestnetFarmConfig = [
    ...pinnedFarmConfig,
    {
        pid: 1,
        chainId: chains_1.ChainId.ZKSYNC_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.zkSyncTestnetTokens.weth,
        token1: tokens_1.zkSyncTestnetTokens.mock,
        feeAmount: v3_sdk_1.FeeAmount.LOW,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.zkSyncTestnetTokens.weth, tokens_1.zkSyncTestnetTokens.mock, v3_sdk_1.FeeAmount.LOW),
    },
    {
        pid: 2,
        chainId: chains_1.ChainId.ZKSYNC_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.zkSyncTestnetTokens.weth,
        token1: tokens_1.zkSyncTestnetTokens.mockC,
        feeAmount: v3_sdk_1.FeeAmount.MEDIUM,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.zkSyncTestnetTokens.weth, tokens_1.zkSyncTestnetTokens.mockC, v3_sdk_1.FeeAmount.MEDIUM),
    },
    {
        pid: 3,
        chainId: chains_1.ChainId.ZKSYNC_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.zkSyncTestnetTokens.mockD,
        token1: tokens_1.zkSyncTestnetTokens.mockC,
        feeAmount: v3_sdk_1.FeeAmount.HIGH,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.zkSyncTestnetTokens.mockD, tokens_1.zkSyncTestnetTokens.mockC, v3_sdk_1.FeeAmount.HIGH),
    },
];
exports.default = exports.zkSyncTestnetFarmConfig;
/** @deprecated */
exports.legacyV3ZkSyncTestnetFarmConfig = (0, defineFarmV3Configs_1.defineFarmV3ConfigsFromUniversalFarm)(exports.zkSyncTestnetFarmConfig.filter((farm) => farm.protocol === types_1.Protocol.V3));
/** @deprecated */
exports.legacyFarmConfig = [];
