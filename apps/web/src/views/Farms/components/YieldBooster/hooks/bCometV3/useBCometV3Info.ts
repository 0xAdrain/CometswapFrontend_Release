import { ChainId } from '@cometswap/chains'
import { bCometSupportedChainId } from '@cometswap/farms'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import BN from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBCometFarmBoosterV3Contract, useBCometFarmBoosterCometContract, useMasterchefV3 } from 'hooks/useContract'
import _toNumber from 'lodash/toNumber'
import { useCallback, useMemo } from 'react'
import { useCometLockStatus } from 'views/CometStaking/hooks/useCometUserInfo'
import { CometLockStatus } from 'views/CometStaking/types'
import { useReadContract } from '@cometswap/wagmi'
import { PRECISION_FACTOR, getUserMultiplier } from './multiplierAPI'

export const USER_ESTIMATED_MULTIPLIER = 2

const QUERY_SETTINGS_WITHOUT_REFETCH = {
  retry: 3,
  retryDelay: 3000,
  placeholderData: keepPreviousData,
}

export const useBakeV3farmCanBoost = (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCometFarmBoosterCometContract()
  const { data } = useReadContract({
    abi: farmBoosterV3Contract.abi,
    address: farmBoosterV3Contract.address,
    chainId,
    functionName: 'whiteList',
    query: {
      enabled: Boolean(chainId && farmPid && bCometSupportedChainId.includes(chainId)),
    },
    args: [BigInt(farmPid ?? 0)],
  })
  return { farmCanBoost: data }
}

export const useIsBoostedPoolLegacy = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCometFarmBoosterV3Contract()
  const { data, refetch } = useQuery({
    queryKey: [`v3/bcomet/isBoostedPoolLegacy/${chainId}/${tokenId}`],
    queryFn: () => farmBoosterV3Contract.read.isBoostedPool([BigInt(tokenId ?? 0)]),
    enabled: Boolean(chainId && tokenId && tokenId !== 'undefined'),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })
  return { isBoosted: data?.[0], pid: Number(data?.[1]), mutate: refetch }
}

export const useIsBoostedPool = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCometFarmBoosterCometContract()
  const { data, refetch } = useQuery({
    queryKey: [`v3/bcomet/isBoostedPool/${chainId}/${tokenId}`],
    queryFn: () => farmBoosterV3Contract.read.isBoostedPool([BigInt(tokenId ?? 0)]),
    enabled: Boolean(chainId && tokenId && tokenId !== 'undefined'),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })
  return { isBoosted: data?.[0], pid: Number(data?.[1]), mutate: refetch }
}

export const useUserPositionInfo = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const masterChefV3 = useMasterchefV3()
  const { data, refetch } = useQuery({
    queryKey: [`v3/masterChef/userPositionInfos/${chainId}/${tokenId}`],
    queryFn: () => masterChefV3?.read.userPositionInfos([BigInt(tokenId ?? 0)]),
    enabled: Boolean(chainId && tokenId),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })

  return {
    data: {
      liquidity: data?.[0],
      boostLiquidity: data?.[1],
      tickLower: data?.[2],
      tickUpper: data?.[3],
      rewardGrowthInside: data?.[4],
      reward: data?.[5],
      user: data?.[6],
      pid: data?.[7],
      boostMultiplier: _toNumber(new BN(data?.[8]?.toString() ?? 0).div(PRECISION_FACTOR).toString()),
    },
    updateUserPositionInfo: refetch,
  }
}

export const useUserBoostedPoolsTokenId = () => {
  const { account, chainId } = useAccountActiveChain()
  const farmBoosterV3Contract = useBCometFarmBoosterCometContract()
  const farmBoosterV3ContractLegacy = useBCometFarmBoosterV3Contract()

  const { data, refetch } = useQuery({
    queryKey: [`v3/bcomet/userBoostedPools/${chainId}/${account}`],
    queryFn: () => farmBoosterV3Contract.read.activedPositions([account ?? '0x']),
    enabled: Boolean(chainId && account),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })

  const { data: dataLegacy, refetch: refetchLegacy } = useQuery({
    queryKey: [`v3/bcomet/userBoostedPoolsLegacy/${chainId}/${account}`],
    queryFn: () => farmBoosterV3ContractLegacy.read.activedPositions([account ?? '0x']),
    enabled: Boolean(chainId && account),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })

  const updateBoostedPoolsTokenId = useCallback(() => {
    refetch()
    refetchLegacy()
  }, [refetch, refetchLegacy])

  return useMemo(() => {
    const tokenIds = data?.map((tokenId) => Number(tokenId)) ?? []
    const tokenIdsLegacy = dataLegacy?.map((tokenId) => Number(tokenId)) ?? []

    return {
      tokenIds: [...tokenIds, ...tokenIdsLegacy],
      updateBoostedPoolsTokenId,
    }
  }, [data, dataLegacy, updateBoostedPoolsTokenId])
}

export const useCometUserMultiplierBeforeBoosted = (tokenId?: string) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCometFarmBoosterCometContract()
  const { data, refetch } = useQuery({
    queryKey: [`v3/bcomet/useUserMultiplierBeforeBoosted/${chainId}/${tokenId}`],
    queryFn: () => getUserMultiplier({ address: farmBoosterV3Contract.address, tokenId, chainId }),
    enabled: Boolean(chainId && tokenId),
    ...QUERY_SETTINGS_WITHOUT_REFETCH,
  })

  return {
    vecometUserMultiplierBeforeBoosted: data ? (data > 2 ? 2 : data) : 1,
    updatedUserMultiplierBeforeBoosted: refetch,
  }
}

export const useBCometBoostLimitAndLockInfo = (targetChain: ChainId = ChainId.BSC) => {
  const { status } = useCometLockStatus(targetChain)
  const isLockEnd = useMemo(() => status === CometLockStatus.Expired, [status])
  const locked = useMemo(() => status === CometLockStatus.Locking, [status])

  return { locked, isLockEnd }
}

