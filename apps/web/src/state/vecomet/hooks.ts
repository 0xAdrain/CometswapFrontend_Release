import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  approveAndLockStatusAtom,
  cometLockAmountAtom,
  cometLockApprovedAtom,
  cometLockTxHashAtom,
  cometLockWeeksAtom,
} from './atoms'

export const useVeCometApproveAndLockStatus = () => {
  return useAtomValue(approveAndLockStatusAtom)
}

export const useLockveCometData = () => {
  const cometLockApproved = useAtomValue(cometLockApprovedAtom)
  const status = useVeCometApproveAndLockStatus()
  const cometLockAmount = useAtomValue(cometLockAmountAtom)
  const cometLockWeeks = useAtomValue(cometLockWeeksAtom)
  const cometLockTxHash = useAtomValue(cometLockTxHashAtom)

  return {
    status,
    cometLockApproved,
    cometLockAmount,
    cometLockWeeks,
    cometLockTxHash,
  }
}

export const useLockveCometDataResetCallback = () => {
  const setveCometLockAmount = useSetAtom(cometLockAmountAtom)
  const setveCometLockWeeks = useSetAtom(cometLockWeeksAtom)

  return useCallback(() => {
    setveCometLockAmount('0')
    setveCometLockWeeks('10')
  }, [setveCometLockAmount, setveCometLockWeeks])
}

