import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useV2CometEarning = (pid?: number) => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      earnings: new BigNumber(0),
      earningsUsd: 0,
      isLoading: false,
    }
  }, [account, pid])
}

export const useV3CometEarningsByPool = (poolAddress?: string) => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      earnings: new BigNumber(0),
      earningsUsd: 0,
      isLoading: false,
    }
  }, [account, poolAddress])
}




