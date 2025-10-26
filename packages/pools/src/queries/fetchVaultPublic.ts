import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { ChainId } from '@cometswap/chains'
import { COMET } from '@cometswap/tokens'
import { Address } from 'viem'

import { cometVaultV2ABI } from '../abis/ICometVaultV2'
import { OnChainProvider } from '../types'
import { getCometFlexibleSideVaultAddress, getCometVaultAddress } from './getAddresses'

interface Params {
  cometVaultAddress?: Address
  chainId: ChainId
  provider: OnChainProvider
}

const balanceOfAbi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const fetchPublicVaultData = async ({
  chainId,
  cometVaultAddress = getCometVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalLockedAmount, totalCometInVault] = await client.multicall({
      contracts: [
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'totalLockedAmount',
        },
        {
          abi: balanceOfAbi,
          address: COMET[ChainId.BSC].address,
          functionName: 'balanceOf',
          args: [cometVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber =
      shares.status === 'success' && shares.result ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber =
      totalLockedAmount.status === 'success' && totalLockedAmount.result
        ? new BigNumber(totalLockedAmount.result.toString())
        : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' && sharePrice.result ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO

    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCometInVault: totalCometInVault.result ? new BigNumber(totalCometInVault.result.toString()).toJSON() : '0',
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalCometInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async ({
  chainId,
  cometVaultAddress = getCometFlexibleSideVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalCometInVault] = await client.multicall({
      contracts: [
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: balanceOfAbi,
          address: COMET[ChainId.BSC].address,
          functionName: 'balanceOf',
          args: [cometVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares.status === 'success' ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCometInVault: new BigNumber((totalCometInVault.result || '0').toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCometInVault: null,
    }
  }
}

export const fetchVaultFees = async ({
  chainId,
  cometVaultAddress = getCometVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [performanceFee, withdrawalFee, withdrawalFeePeriod] = await client.multicall({
      contracts: [
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'performanceFee',
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'withdrawFee',
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'withdrawFeePeriod',
        },
      ],
      allowFailure: false,
    })

    return {
      performanceFee: Number(performanceFee),
      withdrawalFee: Number(withdrawalFee),
      withdrawalFeePeriod: Number(withdrawalFeePeriod),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}
