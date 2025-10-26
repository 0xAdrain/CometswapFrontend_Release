import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useProxyVeCometBalance = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      balance: new BigNumber(0),
      isLoading: false,
      fetchStatus: 'idle' as const,
      refetch: () => Promise.resolve(),
    }
  }, [account])
}


