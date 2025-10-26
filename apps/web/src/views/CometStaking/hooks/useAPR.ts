import { ChainId } from '@cometswap/chains'
import { Percent } from '@cometswap/swap-sdk-core'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { COMET_PER_BLOCK } from 'config'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { WEEK } from 'config/constants/Comet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import {
  getMasterChefV2Address,
  getRevenueSharingCometAddress,
  getRevenueSharingCometAddressNoFallback,
} from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { useReadContract } from '@cometswap/wagmi'
import { CometPoolType } from '../types'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'
import { useVeCometTotalSupply } from './useVeCometTotalSupply'
import { useVeCometUserInfo } from './useVeCometUserInfo'

export const useUserCometTVL = (): bigint => {
  const { data } = useVeCometUserInfo()

  return useMemo(() => {
    if (!data) return 0n
    if (data.cakePoolType === CometPoolType.DELEGATED) return data.amount
    return data.amount + data.cakeAmount
  }, [data])
}

// A mock pool which OP harvests weekly and inject rewards to RevenueSharingComet
const pid = 172n

export const useUserSharesPercent = (): Percent => {
  const { balance } = useVeCometBalance()
  const { data: totalSupply } = useVeCometTotalSupply()

  return useMemo(() => {
    if (!totalSupply || totalSupply.isZero()) return new Percent(0, 1)
    return new Percent(balance.toString(), totalSupply.toString())
  }, [balance, totalSupply])
}

export const useVeCometPoolEmission = () => {
  const { chainId } = useActiveChainId()
  const client = useMemo(() => {
    return publicClient({
      chainId: chainId && [ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId) ? chainId : ChainId.BSC,
    })
  }, [chainId])

  const { data } = useQuery({
    queryKey: ['Comet/cakePoolEmission', client?.chain?.id],

    queryFn: async () => {
      const response = await client.multicall({
        contracts: [
          {
            address: getMasterChefV2Address(client?.chain?.id)!,
            abi: masterChefV2ABI,
            functionName: 'cakeRateToSpecialFarm',
          } as const,
          {
            address: getMasterChefV2Address(client?.chain?.id)!,
            abi: masterChefV2ABI,
            functionName: 'poolInfo',
            args: [pid],
          } as const,
          {
            address: getMasterChefV2Address(client?.chain?.id)!,
            abi: masterChefV2ABI,
            functionName: 'totalSpecialAllocPoint',
          } as const,
        ],
        allowFailure: false,
      })

      const cakeRateToSpecialFarm = response[0] ?? 0n
      const allocPoint = response[1][2] ?? 0n
      const totalSpecialAllocPoint = response[2] ?? 0n
      return [cakeRateToSpecialFarm, allocPoint, totalSpecialAllocPoint]
    },
  })

  return useMemo(() => {
    if (!data) return BIG_ZERO
    const [cakeRateToSpecialFarm, allocPoint, totalSpecialAllocPoint] = data

    return new BigNumber(COMET_PER_BLOCK)
      .times(new BigNumber(cakeRateToSpecialFarm.toString()).div(1e12))
      .times(allocPoint.toString())
      .div((totalSpecialAllocPoint ?? 1n).toString())
  }, [data])
}

export const useVeCometPoolAPR = () => {
  const cakePoolEmission = useVeCometPoolEmission()
  const userSharesPercent = useUserSharesPercent()
  const userCometTVL = useUserCometTVL()

  return useMemo(() => {
    if (!cakePoolEmission || !userSharesPercent?.denominator || !userCometTVL) return new Percent(0, 1)

    return new Percent(
      new BigNumber(cakePoolEmission)
        .times(1e18)
        .times(24 * 60 * 60 * 365)
        .times(userSharesPercent.numerator.toString())
        .toFixed(0),
      (userCometTVL * userSharesPercent.denominator * 3n).toString(),
    )
  }, [cakePoolEmission, userSharesPercent, userCometTVL])
}

const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60

export const useRevShareEmission = () => {
  const { chainId } = useActiveChainId()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: totalDistributed } = useReadContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingCometAddress(chainId),
    functionName: 'totalDistributed',
    chainId: getRevenueSharingCometAddressNoFallback(chainId) ? chainId : ChainId.BSC,
  })
  const lastThursday = useMemo(() => {
    return Math.floor(currentTimestamp / WEEK) * WEEK
  }, [currentTimestamp])
  return useMemo(() => {
    if (!totalDistributed) return BIG_ZERO
    // 1700697600 is the timestamp of the first distribution
    return new BigNumber(totalDistributed.toString()).dividedBy(lastThursday - 1700697600)
  }, [totalDistributed, lastThursday])
}

export const useRevenueSharingAPR = () => {
  const userSharesPercent = useUserSharesPercent()
  const userCometTVL = useUserCometTVL()
  const revShareEmission = useRevShareEmission()

  return useMemo(() => {
    if (!revShareEmission || !userSharesPercent?.denominator || !userCometTVL) return new Percent(0, 1)

    return new Percent(
      new BigNumber(revShareEmission).times(SECONDS_IN_YEAR).times(userSharesPercent.numerator.toString()).toFixed(0),
      (userCometTVL * userSharesPercent.denominator).toString(),
    )
  }, [revShareEmission, userCometTVL, userSharesPercent])
}

export const useVeCometAPR = () => {
  const cakePoolAPR = useVeCometPoolAPR()
  const revenueSharingAPR = useRevenueSharingAPR()

  const totalAPR = useMemo(() => {
    if (!cakePoolAPR || !revenueSharingAPR) return new Percent(0, 1)
    return cakePoolAPR.add(revenueSharingAPR)
  }, [cakePoolAPR, revenueSharingAPR])

  return {
    totalAPR,
    cakePoolAPR,
    revenueSharingAPR,
  }
}

export const BRIBE_APR = 20
export const useFourYearTotalCometApr = () => {
  const revShareEmission = useRevShareEmission()
  const cakePoolEmission = useVeCometPoolEmission()
  const { data: totalSupply } = useVeCometTotalSupply()

  const veCOMETPoolApr = useMemo(
    () =>
      new BigNumber(new BigNumber(cakePoolEmission).div(3).times(24 * 60 * 60 * 365))
        .div(totalSupply.div(1e18))
        .times(100),
    [cakePoolEmission, totalSupply],
  )

  const revShareEmissionApr = useMemo(
    () =>
      new BigNumber(revShareEmission)
        .times(24 * 60 * 60 * 365)
        .div(totalSupply)
        .times(100),
    [revShareEmission, totalSupply],
  )

  const total = useMemo(
    () => veCOMETPoolApr.plus(revShareEmissionApr).plus(BRIBE_APR),
    [veCOMETPoolApr, revShareEmissionApr],
  )

  return {
    totalApr: total,
    veCOMETPoolApr: veCOMETPoolApr.toString(),
    revShareEmissionApr: revShareEmissionApr.toString(),
  }
}

