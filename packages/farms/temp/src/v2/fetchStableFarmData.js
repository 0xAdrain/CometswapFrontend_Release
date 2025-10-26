"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStableFarmData = fetchStableFarmData;
const chains_1 = require("@cometswap/chains");
const chunk_1 = __importDefault(require("lodash/chunk"));
const viem_1 = require("viem");
const stableSwapAbi = [
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'coins',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'balances',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'i', type: 'uint256' },
            { internalType: 'uint256', name: 'j', type: 'uint256' },
            { internalType: 'uint256', name: 'dx', type: 'uint256' },
        ],
        name: 'get_dy',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
async function fetchStableFarmData(farms, chainId = chains_1.ChainId.BSC, provider) {
    const calls = farms.flatMap((f) => [
        {
            abi: stableSwapAbi,
            address: f.stableSwapAddress,
            functionName: 'balances',
            args: [0n],
        },
        {
            abi: stableSwapAbi,
            address: f.stableSwapAddress,
            functionName: 'balances',
            args: [1n],
        },
        {
            abi: stableSwapAbi,
            address: f.stableSwapAddress,
            functionName: 'get_dy',
            args: [0n, 1n, (0, viem_1.parseUnits)('1', f.token.decimals)],
        },
        {
            abi: stableSwapAbi,
            address: f.stableSwapAddress,
            functionName: 'get_dy',
            args: [1n, 0n, (0, viem_1.parseUnits)('1', f.quoteToken.decimals)],
        },
    ]);
    const chunkSize = calls.length / farms.length;
    const results = await provider({ chainId }).multicall({
        contracts: calls,
        allowFailure: false,
    });
    return (0, chunk_1.default)(results, chunkSize);
}
