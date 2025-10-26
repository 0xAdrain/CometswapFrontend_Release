import { Protocol } from '@cometswap/farms'
import { Percent } from '@cometswap/swap-sdk-core'
import { cometV3PoolABI } from '@cometswap/v3-sdk'
import { useReadContract } from '@cometswap/wagmi'
import { stableSwapABI } from 'config/abi/stableSwapAbi'
import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { Address } from 'viem'

const STABLE_POOL_FEE_DENOMINATOR = BigInt(1e10)
export const v2Fee = new Percent(10000 - 9975, 10000)

export const usePoolFee = (poolAddress: Address | undefined, poolProtocol?: Protocol) => {
  const chainId = useChainIdByQuery()
  const isV2 = useMemo(() => poolProtocol === 'v2', [poolProtocol])
  const enabled = useMemo(() => {
    return Boolean(poolAddress) && !isV2
  }, [isV2, poolAddress])
  const { data, isLoading } = useReadContract({
    query: {
      enabled,
    },
    chainId,
    abi: enabled ? cometV3PoolABI : stableSwapABI,
    address: poolAddress!,
    functionName: 'fee',
  })
  const fee = useMemo(() => {
    if (isV2) {
      return v2Fee
    }
    return new Percent(data ?? 0n, poolProtocol === 'stable' ? STABLE_POOL_FEE_DENOMINATOR : 1e6)
  }, [data, isV2, poolProtocol])

  return {
    fee,
    isLoading,
  }
}

