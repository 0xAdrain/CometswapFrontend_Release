import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useProxyCometBalance = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      balance: new BigNumber(0),
      fetchStatus: 'idle' as const,
      isLoading: false,
      refetch: () => Promise.resolve(),
    }
  }, [account])
}


