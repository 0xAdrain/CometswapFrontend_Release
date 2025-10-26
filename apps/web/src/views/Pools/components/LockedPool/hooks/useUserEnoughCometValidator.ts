import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export const useUserEnoughCometValidator = (amount: string) => {
  const { address: account } = useAccount()

  return useMemo(() => {
    const amountBN = new BigNumber(amount || 0)
    
    return {
      isValid: true, // Placeholder - always valid
      error: null,
      isLoading: false,
    }
  }, [account, amount])
}


