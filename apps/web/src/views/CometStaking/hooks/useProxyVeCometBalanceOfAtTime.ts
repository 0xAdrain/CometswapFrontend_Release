import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useProxyVeCometBalanceOfAtTime = (timestamp?: number) => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      balance: new BigNumber(0),
      isLoading: false,
      fetchStatus: 'idle' as const,
    }
  }, [account, timestamp])
}




