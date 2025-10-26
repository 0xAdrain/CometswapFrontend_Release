"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPublicFarmsData = void 0;
const chains_1 = require("@cometswap/chains");
const chunk_1 = __importDefault(require("lodash/chunk"));
const const_1 = require("../const");
const abi = [
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
const fetchFarmCalls = (farm, masterChefAddress, vaultAddress) => {
    const { lpAddress, token, quoteToken, bveCometWrapperAddress } = farm;
    return [
        // Balance of token in the LP contract
        {
            abi,
            address: token.address,
            functionName: 'balanceOf',
            args: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
            abi,
            address: quoteToken.address,
            functionName: 'balanceOf',
            args: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
            abi,
            address: lpAddress,
            functionName: 'balanceOf',
            args: [(bveCometWrapperAddress || vaultAddress || masterChefAddress)],
        },
        // Total supply of LP tokens
        {
            abi,
            address: lpAddress,
            functionName: 'totalSupply',
        },
    ];
};
const fetchPublicFarmsData = async (farms, chainId = chains_1.ChainId.BSC, provider, masterChefAddress) => {
    try {
        const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, masterChefAddress, const_1.crossFarmingVaultAddresses[chainId]));
        const chunkSize = farmCalls.length / farms.length;
        const farmMultiCallResult = await provider({ chainId }).multicall({ contracts: farmCalls, allowFailure: false });
        return (0, chunk_1.default)(farmMultiCallResult, chunkSize);
    }
    catch (error) {
        console.error('MasterChef Public Data error ', error);
        throw error;
    }
};
exports.fetchPublicFarmsData = fetchPublicFarmsData;
