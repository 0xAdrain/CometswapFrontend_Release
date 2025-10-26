import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useStatusViewCometWellSync = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      isSynced: true,
      isLoading: false,
      syncStatus: 'synced' as const,
      lastSyncTime: Date.now(),
    }
  }, [account])
}




