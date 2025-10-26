import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useAccountV2PendingCometReward = () => {
  const { address: account } = useAccount()

  return useMemo(() => ({
    pendingReward: '0',
    isLoading: false,
  }), [account])
}


