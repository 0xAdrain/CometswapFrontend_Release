import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useTargetUnlockTime = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      targetUnlockTime: 0,
      isLoading: false,
    }
  }, [account])
}