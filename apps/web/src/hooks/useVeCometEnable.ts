import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useVeCometEnable = () => {
  const { address: account } = useAccount()

  const handleEnable = useCallback(async () => {
    // Placeholder implementation
    return Promise.resolve()
  }, [account])

  return useMemo(() => ({
    isEnabled: true, // Placeholder - always enabled
    isLoading: false,
    handleEnable,
  }), [handleEnable])
}


