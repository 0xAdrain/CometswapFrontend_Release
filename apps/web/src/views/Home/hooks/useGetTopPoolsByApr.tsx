import { Token } from '@cometswap/sdk'
import { Pool } from '@cometswap/widgets-internal'
import { useQuery } from '@tanstack/react-query'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import {
  fetchCometVaultFees,
  fetchCometVaultPublicData,
  fetchPoolsConfigAsync,
  fetchPoolsPublicDataAsync,
} from 'state/pools'
import { usePoolsWithVault } from 'state/pools/hooks'
import { VaultKey } from 'state/types'

const useGetTopPoolsByApr = (isIntersecting: boolean, chainId?: number) => {
  const dispatch = useAppDispatch()
  const [topPools, setTopPools] = useState<(Pool.DeserializedPool<Token> | any)[]>(() => [null, null, null, null, null])
  const { pools } = usePoolsWithVault()

  const { status: fetchStatus, isFetching } = useQuery({
    queryKey: [chainId, 'fetchTopPoolsByApr'],

    queryFn: async () => {
      if (!chainId) return null
      await dispatch(fetchPoolsConfigAsync({ chainId }))
      return Promise.all([
        dispatch(fetchCometVaultFees(chainId!)),
        dispatch(fetchCometVaultPublicData(chainId!)),
        dispatch(fetchPoolsPublicDataAsync(chainId!)),
      ])
    },

    enabled: Boolean(isIntersecting && chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const [cakePools, otherPools] = partition(pools, (pool) => pool.sousId === 0)
    const masterCometPool = cakePools.filter((cometPool) => cometPool.vaultKey === VaultKey.CometVault)
    const getTopPoolsByApr = (activePools: (Pool.DeserializedPool<Token> | any)[]) => {
      const sortedByApr = orderBy(activePools, (pool: Pool.DeserializedPool<Token>) => pool.apr || 0, 'desc')
      setTopPools([...masterCometPool, ...sortedByApr.slice(0, 4)])
    }
    if (fetchStatus === 'success' && !isFetching) {
      getTopPoolsByApr(otherPools)
    }
  }, [setTopPools, pools, isFetching, fetchStatus])

  return { topPools }
}

export default useGetTopPoolsByApr

