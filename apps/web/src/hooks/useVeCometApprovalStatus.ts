import { useMemo } from 'react'
import { useAccount } from 'wagmi'

const useVeCometApprovalStatus = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      isApproved: true, // Placeholder - always approved
      isLoading: false,
      refetch: () => Promise.resolve(),
    }
  }, [account])
}

export default useVeCometApprovalStatus




