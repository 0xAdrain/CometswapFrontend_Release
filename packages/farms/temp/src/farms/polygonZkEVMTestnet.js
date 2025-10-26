"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyFarmConfig = exports.legacyV3PolygonZkEVMTestnetFarmConfig = exports.polygonZkEVMTestnetFarmConfig = void 0;
const chains_1 = require("@cometswap/chains");
const tokens_1 = require("@cometswap/tokens");
const v3_sdk_1 = require("@cometswap/v3-sdk");
const defineFarmV3Configs_1 = require("../defineFarmV3Configs");
const types_1 = require("../types");
const pinnedFarmConfig = [];
exports.polygonZkEVMTestnetFarmConfig = [
    ...pinnedFarmConfig,
    {
        pid: 1,
        chainId: chains_1.ChainId.POLYGON_ZKEVM_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.polygonZkEvmTestnetTokens.weth,
        token1: tokens_1.polygonZkEvmTestnetTokens.mockA,
        feeAmount: v3_sdk_1.FeeAmount.LOW,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.polygonZkEvmTestnetTokens.weth, tokens_1.polygonZkEvmTestnetTokens.mockA, v3_sdk_1.FeeAmount.LOW),
    },
    {
        pid: 2,
        chainId: chains_1.ChainId.POLYGON_ZKEVM_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.polygonZkEvmTestnetTokens.weth,
        token1: tokens_1.polygonZkEvmTestnetTokens.mockB,
        feeAmount: v3_sdk_1.FeeAmount.MEDIUM,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.polygonZkEvmTestnetTokens.weth, tokens_1.polygonZkEvmTestnetTokens.mockB, v3_sdk_1.FeeAmount.MEDIUM),
    },
    {
        pid: 3,
        chainId: chains_1.ChainId.POLYGON_ZKEVM_TESTNET,
        protocol: types_1.Protocol.V3,
        token0: tokens_1.polygonZkEvmTestnetTokens.mockB,
        token1: tokens_1.polygonZkEvmTestnetTokens.mockC,
        feeAmount: v3_sdk_1.FeeAmount.HIGH,
        lpAddress: v3_sdk_1.Pool.getAddress(tokens_1.polygonZkEvmTestnetTokens.mockB, tokens_1.polygonZkEvmTestnetTokens.mockC, v3_sdk_1.FeeAmount.HIGH),
    },
];
exports.default = exports.polygonZkEVMTestnetFarmConfig;
/** @deprecated */
exports.legacyV3PolygonZkEVMTestnetFarmConfig = (0, defineFarmV3Configs_1.defineFarmV3ConfigsFromUniversalFarm)(exports.polygonZkEVMTestnetFarmConfig.filter((farm) => farm.protocol === types_1.Protocol.V3));
/** @deprecated */
exports.legacyFarmConfig = [];
