import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

const useVComet = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      balance: new BigNumber(0),
      lockedAmount: new BigNumber(0),
      lockEndTime: 0,
      isLoading: false,
      fetchStatus: 'idle' as const,
    }
  }, [account])
}

export default useVComet


