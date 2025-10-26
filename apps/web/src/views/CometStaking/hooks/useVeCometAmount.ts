import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useVeCometAmount = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      amount: new BigNumber(0),
      isLoading: false,
    }
  }, [account])
}