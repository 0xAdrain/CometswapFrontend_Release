import BigNumber from 'bignumber.js'
import { ChainId } from '@cometswap/chains'
import { Address } from 'viem'

import { OnChainProvider, SerializedLockedVaultUser, SerializedVaultUser } from '../types'
import { cometVaultV2ABI } from '../abis/ICometVaultV2'
import { getCometFlexibleSideVaultAddress, getCometVaultAddress } from './getAddresses'
import { cometFlexibleSideVaultV2ABI } from '../abis/ICometFlexibleSideVaultV2'

interface Params {
  account: Address
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchVaultUser = async ({ account, chainId, provider }: Params): Promise<SerializedLockedVaultUser> => {
  try {
    const cometVaultAddress = getCometVaultAddress(chainId)

    const client = provider({ chainId })

    const [userContractResponse, currentPerformanceFee, currentOverdueFee] = await client.multicall({
      contracts: [
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'userInfo',
          args: [account],
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'calculatePerformanceFee',
          args: [account],
        },
        {
          abi: cometVaultV2ABI,
          address: cometVaultAddress,
          functionName: 'calculateOverdueFee',
          args: [account],
        },
      ],
      allowFailure: false,
    })

    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse[0].toString()).toJSON(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      cometAtLastUserAction: new BigNumber(userContractResponse[2].toString()).toJSON(),
      userBoostedShare: new BigNumber(userContractResponse[6].toString()).toJSON(),
      locked: userContractResponse[7],
      lockEndTime: userContractResponse[5].toString(),
      lockStartTime: userContractResponse[4].toString(),
      lockedAmount: new BigNumber(userContractResponse[8].toString()).toJSON(),
      currentPerformanceFee: new BigNumber(currentPerformanceFee.toString()).toJSON(),
      currentOverdueFee: new BigNumber(currentOverdueFee.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      cometAtLastUserAction: '',
      userBoostedShare: '',
      lockEndTime: '',
      lockStartTime: '',
      locked: false,
      lockedAmount: '',
      currentPerformanceFee: '',
      currentOverdueFee: '',
    }
  }
}

export const fetchFlexibleSideVaultUser = async ({
  account,
  chainId,
  provider,
}: Params): Promise<SerializedVaultUser> => {
  try {
    const userContractResponse = await await provider({ chainId }).readContract({
      abi: cometFlexibleSideVaultV2ABI,
      address: getCometFlexibleSideVaultAddress(chainId),
      functionName: 'userInfo',
      args: [account],
    })
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse[0].toString()).toJSON(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      cometAtLastUserAction: new BigNumber(userContractResponse[2].toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      cometAtLastUserAction: '',
    }
  }
}
