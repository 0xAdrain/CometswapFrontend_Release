import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCometFarmWrapperBoosterCometContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { Address } from 'viem'

const SHOULD_UPDATE_THRESHOLD = 1.1

export const useWrapperBooster = (bCometBoosterAddress: Address, boostMultiplier: number, wrapperAddress?: Address) => {
  const bCometFarmWrapperBoosterCometContract = useBCometFarmWrapperBoosterCometContract()
  const { account } = useActiveWeb3React()
  const { data, refetch } = useQuery({
    queryKey: ['useWrapperBooster', bCometBoosterAddress, account, wrapperAddress],
    queryFn: () =>
      bCometFarmWrapperBoosterCometContract.read.getUserMultiplierByWrapper([account ?? '0x', wrapperAddress ?? '0x']),
    enabled: !!bCometBoosterAddress && !!account && !!wrapperAddress,
    refetchInterval: 10000,
    staleTime: 10000,
    gcTime: 10000,
  })

  const { data: BOOST_PRECISION } = useQuery({
    queryKey: ['useWrapperBooster_BOOST_PRECISION', bCometBoosterAddress],
    queryFn: () => bCometFarmWrapperBoosterCometContract.read.BOOST_PRECISION(),
    enabled: !!bCometBoosterAddress,
  })

  const vecometUserMultiplierBeforeBoosted = useMemo(() => {
    return data && BOOST_PRECISION && Boolean(wrapperAddress)
      ? Number(new BigNumber(data.toString()).div(BOOST_PRECISION.toString()))
      : 0
  }, [BOOST_PRECISION, data, wrapperAddress])

  const shouldUpdate = useMemo(() => {
    if (
      (boostMultiplier &&
        vecometUserMultiplierBeforeBoosted &&
        boostMultiplier * SHOULD_UPDATE_THRESHOLD <= vecometUserMultiplierBeforeBoosted) ||
      (boostMultiplier === 1 && vecometUserMultiplierBeforeBoosted > boostMultiplier)
    )
      return true
    return false
  }, [boostMultiplier, vecometUserMultiplierBeforeBoosted])

  return { vecometUserMultiplierBeforeBoosted, refetchWrapperBooster: refetch, shouldUpdate }
}

export const useIsWrapperWhiteList = (bCometBoosterAddress?: Address, wrapperAddress?: Address) => {
  const bCometFarmWrapperBoosterCometContract = useBCometFarmWrapperBoosterCometContract()
  const { data } = useQuery({
    queryKey: ['useIsWrapperWhiteList', bCometBoosterAddress, wrapperAddress],
    queryFn: () => bCometFarmWrapperBoosterCometContract.read.whiteListWrapper([wrapperAddress ?? '0x']),
    enabled: !!bCometBoosterAddress && !!wrapperAddress,
    refetchInterval: 10000,
    staleTime: 10000,
    gcTime: 10000,
  })

  const isBoosterWhiteList = useMemo(() => {
    if (!bCometBoosterAddress || !wrapperAddress) return false
    return Boolean(data)
  }, [bCometBoosterAddress, data, wrapperAddress])

  return { isBoosterWhiteList }
}

