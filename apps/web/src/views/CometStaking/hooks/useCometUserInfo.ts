import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export enum CometLockStatus {
  NOT_LOCKED = 'NOT_LOCKED',
  LOCKED = 'LOCKED',
  EXPIRED = 'EXPIRED',
}

export const useCometLockStatus = () => {
  const { address: account } = useAccount()

  return useMemo(() => {
    return {
      status: CometLockStatus.NOT_LOCKED,
      lockEndTime: 0,
      lockStartTime: 0,
      lockedAmount: '0',
      isLoading: false,
    }
  }, [account])
}