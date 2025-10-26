import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { approveAndLockStatusAtom, cometLockApprovedAtom } from './atoms'

export const useLockCometData = () => {
  const [approveAndLockStatus] = useAtom(approveAndLockStatusAtom)
  const [cometLockApproved] = useAtom(cometLockApprovedAtom)

  return useMemo(
    () => ({
      approveAndLockStatus,
      cometLockApproved,
    }),
    [approveAndLockStatus, cometLockApproved]
  )
}

export const useSetLockCometData = () => {
  const [, setApproveAndLockStatus] = useAtom(approveAndLockStatusAtom)
  const [, setCometLockApproved] = useAtom(cometLockApprovedAtom)

  return useMemo(
    () => ({
      setApproveAndLockStatus,
      setCometLockApproved,
    }),
    [setApproveAndLockStatus, setCometLockApproved]
  )
}




