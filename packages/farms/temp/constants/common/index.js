"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COMMON_PRICE = exports.priceHelperTokens = exports.COMET_BNB_LP_MAINNET = void 0;
const chains_1 = require("@cometswap/chains");
const tokens_1 = require("@cometswap/tokens");
exports.COMET_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0';
exports.priceHelperTokens = {
    [chains_1.ChainId.ETHEREUM]: {
        list: [tokens_1.ethereumTokens.weth, tokens_1.ethereumTokens.usdc, tokens_1.ethereumTokens.usdt],
    },
    [chains_1.ChainId.BSC]: {
        list: [
            tokens_1.bscTokens.wbnb,
            tokens_1.bscTokens.usdt,
            tokens_1.bscTokens.busd,
            tokens_1.bscTokens.eth,
            tokens_1.bscTokens.solvbtc,
            tokens_1.bscTokens.solvBTCena,
            tokens_1.bscTokens.boxy,
        ],
    },
    [chains_1.ChainId.POLYGON_ZKEVM]: {
        list: [tokens_1.polygonZkEvmTokens.weth, tokens_1.polygonZkEvmTokens.usdc, tokens_1.polygonZkEvmTokens.usdt, tokens_1.polygonZkEvmTokens.matic],
    },
    [chains_1.ChainId.ZKSYNC]: {
        list: [tokens_1.zksyncTokens.weth, tokens_1.zksyncTokens.usdc, tokens_1.zksyncTokens.usdt],
    },
    [chains_1.ChainId.ARBITRUM_ONE]: {
        list: [
            tokens_1.arbitrumTokens.weth,
            tokens_1.arbitrumTokens.usdc,
            tokens_1.arbitrumTokens.usdt,
            tokens_1.arbitrumTokens.arb,
            tokens_1.arbitrumTokens.usdplus,
            tokens_1.arbitrumTokens.solvBTC,
            tokens_1.arbitrumTokens.solvBTCena,
        ],
    },
    [chains_1.ChainId.LINEA]: {
        list: [tokens_1.lineaTokens.weth, tokens_1.lineaTokens.usdc, tokens_1.lineaTokens.usdt, tokens_1.lineaTokens.wbtc, tokens_1.lineaTokens.dai],
    },
    [chains_1.ChainId.BASE]: {
        list: [tokens_1.baseTokens.weth, tokens_1.baseTokens.usdbc, tokens_1.baseTokens.dai, tokens_1.baseTokens.cbETH, tokens_1.baseTokens.usdc],
    },
    [chains_1.ChainId.OPBNB]: {
        list: [tokens_1.opBnbTokens.wbnb, tokens_1.opBnbTokens.usdt],
    },
};
// for testing purposes
exports.DEFAULT_COMMON_PRICE = {
    [chains_1.ChainId.ETHEREUM]: {},
    [chains_1.ChainId.BSC]: {},
    [chains_1.ChainId.BSC_TESTNET]: {
        [tokens_1.bscTestnetTokens.mockA.address]: '10',
        [tokens_1.bscTestnetTokens.usdt.address]: '1',
        [tokens_1.bscTestnetTokens.busd.address]: '1',
        [tokens_1.bscTestnetTokens.usdc.address]: '1',
    },
    [chains_1.ChainId.ZKSYNC_TESTNET]: {
        [tokens_1.zkSyncTestnetTokens.mock.address]: '10',
    },
    [chains_1.ChainId.POLYGON_ZKEVM]: {},
    [chains_1.ChainId.ZKSYNC]: {},
    [chains_1.ChainId.POLYGON_ZKEVM_TESTNET]: {},
    [chains_1.ChainId.ARBITRUM_ONE]: {},
    [chains_1.ChainId.LINEA]: {},
    [chains_1.ChainId.BASE]: {},
    [chains_1.ChainId.OPBNB_TESTNET]: {},
    [chains_1.ChainId.OPBNB]: {},
};
