import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useUserCometStatus = () => {
  const { address: account } = useAccount()

  return useMemo(() => ({
    hasComet: false,
    balance: '0',
    isLoading: false,
    status: 'idle' as const,
  }), [account])
}


