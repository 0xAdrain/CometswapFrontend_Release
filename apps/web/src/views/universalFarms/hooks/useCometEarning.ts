import { Protocol } from '@cometswap/farms'
import { formatBigInt } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCometPrice } from 'hooks/useCometPrice'
import { useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { useAccountV2PendingCometReward } from 'state/farmsV4/state/accountPositions/hooks/useAccountV2PendingCometReward'
import { PoolInfo, StablePoolInfo, V2PoolInfo } from 'state/farmsV4/state/type'
import { useChainIdByQuery } from 'state/info/hooks'

export const useV2CometEarning = (pool: PoolInfo | null | undefined) => {
  const { account } = useAccountActiveChain()
  const cometPrice = useCometPrice()
  const { chainId, lpAddress } = pool || {}
  const { data: pendingComet, isLoading } = useAccountV2PendingCometReward(account, {
    chainId,
    lpAddress,
    bCometWrapperAddress: (pool as V2PoolInfo | StablePoolInfo)?.bCometWrapperAddress,
  })
  const earningsAmount = useMemo(() => +formatBigInt(BigInt(pendingComet ?? 0), 5), [pendingComet])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount ?? 0).times(cometPrice.toString()).toNumber()
  }, [cometPrice, earningsAmount])

  return {
    earningsAmount,
    earningsBusd,
    isLoading,
  }
}

export const useV3CometEarning = (tokenIds: bigint[] = [], chainId: number) => {
  const cometPrice = useCometPrice()
  const { tokenIdResults: results, isLoading } = useStakedPositionsByUser(tokenIds, chainId)
  const earningsAmount = useMemo(() => {
    return results.reduce((acc, pendingComet = 0n) => acc + pendingComet, 0n)
  }, [results])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount.toString()).times(cometPrice.toString()).div(1e18).toNumber()
  }, [cometPrice, earningsAmount])

  return {
    earningsAmount: +formatBigInt(earningsAmount, 5),
    earningsBusd,
    isLoading,
  }
}

export const useV3CometEarningsByPool = (pool: PoolInfo | null | undefined) => {
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool<Protocol.V3>(
    pool?.chainId ?? chainId,
    account,
    pool ?? undefined,
  )
  const tokenIds = useMemo(() => {
    if (!data?.length) return []
    return data.filter((item) => item.isStaked).map((item) => item.tokenId)
  }, [data])
  const { earningsBusd, earningsAmount } = useV3CometEarning(tokenIds, pool?.chainId ?? chainId)
  return {
    earningsBusd,
    earningsAmount,
    isLoading,
  }
}

