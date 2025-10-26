import { ChainId } from '@cometswap/chains'
import { getSourceChain, isIfoSupported } from '@cometswap/ifos'
import { getLivePoolsConfig } from '@cometswap/pools'
import { Token } from '@cometswap/sdk'
import { Pool } from '@cometswap/widgets-internal'
import { FAST_INTERVAL } from 'config/constants'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useEffect, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useAccount } from 'wagmi'

import { getLegacyFarmConfig } from '@cometswap/farms'
import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  fetchveCometFlexibleSideVaultFees,
  fetchveCometFlexibleSideVaultPublicData,
  fetchveCometFlexibleSideVaultUserData,
  fetchveCometPoolPublicDataAsync,
  fetchveCometPoolUserDataAsync,
  fetchveCometVaultFees,
  fetchveCometVaultPublicData,
  fetchveCometVaultUserData,
  fetchIfoPublicDataAsync,
  fetchPoolsConfigAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsStakingLimitsAsync,
  fetchPoolsUserDataAsync,
  fetchUserIfoCreditDataAsync,
} from '.'
import { fetchFarmsPublicDataAsync } from '../farms'
import { VaultKey } from '../types'
import {
  ifoCeilingSelector,
  ifoCreditSelector,
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  makeVaultPoolWithKeySelector,
  poolsWithVaultSelector,
} from './selectors'

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = (await getLegacyFarmConfig(chainId)) || []
  const livePools = (await getLivePoolsConfig(chainId)) || []
  const lPoolAddresses = livePools
    .filter(({ sousId }) => sousId !== 0)
    .map(({ earningToken, stakingToken }) => {
      if (earningToken.symbol === 'COMET') {
        return stakingToken.address
      }
      return earningToken.address
    })

  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'COMET' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB') ||
          (token.symbol === 'USDT' && quoteToken.symbol === 'BUSD') ||
          lPoolAddresses.find((poolAddress) => poolAddress === token.address)),
    )
    .map((farm) => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      if (!chainId) return
      const activeFarms = await getActiveFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId }))

      batch(() => {
        dispatch(fetchPoolsPublicDataAsync(chainId))
        dispatch(fetchPoolsStakingLimitsAsync(chainId))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool?: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = (vaultKey) => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useEffect(() => {
    if (chainId) {
      dispatch(fetchPoolsConfigAsync({ chainId }))
    }
  }, [dispatch, chainId])
}

export const usePoolsPageFetch = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  usePoolsConfigInitialize()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchveCometVaultPublicData(chainId))
        dispatch(fetchveCometFlexibleSideVaultPublicData(chainId))
        dispatch(fetchIfoPublicDataAsync(chainId))
        if (account) {
          dispatch(fetchPoolsUserDataAsync({ account, chainId }))
          dispatch(fetchveCometVaultUserData({ account, chainId }))
          dispatch(fetchveCometFlexibleSideVaultUserData({ account, chainId }))
        }
      })
    }
  }, [account, chainId, dispatch])

  useEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchveCometVaultFees(chainId))
        dispatch(fetchveCometFlexibleSideVaultFees(chainId))
      })
    }
  }, [dispatch, chainId])
}

export const useVeCometVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useFastRefreshEffect(() => {
    if (account && chainId) {
      dispatch(fetchveCometVaultUserData({ account, chainId }))
    }
  }, [account, dispatch, chainId])
}

export const useVeCometVaultPublicData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useFastRefreshEffect(() => {
    if (chainId) {
      dispatch(fetchveCometVaultPublicData(chainId))
    }
  }, [dispatch, chainId])
}

const useVeCometVaultChain = (chainId?: ChainId) => {
  return useMemo(() => getSourceChain(chainId) || ChainId.BSC, [chainId])
}

export const useFetchIfo = () => {
  const { account, chainId } = useAccountActiveChain()
  const ifoSupported = useMemo(() => isIfoSupported(chainId), [chainId])
  const cometVaultChain = useVeCometVaultChain(chainId)
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  useQuery({
    queryKey: ['fetchIfoPublicData', chainId],

    queryFn: async () => {
      if (chainId && cometVaultChain) {
        batch(() => {
          dispatch(fetchveCometPoolPublicDataAsync())
          dispatch(fetchveCometVaultPublicData(cometVaultChain))
          dispatch(fetchIfoPublicDataAsync(chainId))
        })
      }
      return null
    },

    enabled: Boolean(chainId && ifoSupported),
    refetchInterval: FAST_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useQuery({
    queryKey: ['fetchIfoUserData', account, chainId],

    queryFn: async () => {
      if (chainId && cometVaultChain && account) {
        batch(() => {
          dispatch(fetchveCometPoolUserDataAsync({ account, chainId: cometVaultChain }))
          dispatch(fetchveCometVaultUserData({ account, chainId: cometVaultChain }))
          dispatch(fetchUserIfoCreditDataAsync({ account, chainId }))
        })
      }
      return null
    },

    enabled: Boolean(account && chainId && cometVaultChain),
    refetchInterval: FAST_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useQuery({
    queryKey: ['fetchveCometVaultFees', cometVaultChain],

    queryFn: async () => {
      if (cometVaultChain) {
        dispatch(fetchveCometVaultFees(cometVaultChain))
      }
      return null
    },

    enabled: Boolean(cometVaultChain && ifoSupported),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export const useVeCometVault = () => {
  return useVaultPoolByKey(VaultKey.veCometVault)
}

export const useVaultPoolByKey = (key?: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}

