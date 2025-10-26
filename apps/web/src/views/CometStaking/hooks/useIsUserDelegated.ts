import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useIsUserDelegated = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      isDelegated: false,
      delegateAddress: null,
      isLoading: false,
    }
  }, [account])
}


