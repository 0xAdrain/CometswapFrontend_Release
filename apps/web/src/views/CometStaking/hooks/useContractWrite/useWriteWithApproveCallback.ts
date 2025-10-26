import { ApprovalState } from 'hooks/useApproveCallback'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cometLockTxHashAtom } from 'state/Comet/atoms'
import { useLockCometData } from 'state/Comet/hooks'
import { logGTMClickLockCometEvent } from 'utils/customGTMEventTracking'
import { isUserRejected } from 'utils/sentry'
import { useLockApproveCallback } from '../useLockAllowance'
import { useWriteIncreaseLockAmountCallback } from './useWriteIncreaseLockAmountCallback'
import { useWriteLockCallback } from './useWriteLockCallback'

export const useWriteWithApproveCallback = (onDismiss?: () => void) => {
  const setTxHash = useSetAtom(cometLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { cometLockAmount } = useLockCometData()

  const { approvalState, approveCallback } = useLockApproveCallback(cometLockAmount)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const handleCancel = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
  }, [setStatus])

  return useCallback(
    async (write: () => Promise<unknown>) => {
      setTxHash('')
      try {
        if (approvalState === ApprovalState.NOT_APPROVED) {
          setStatus(ApproveAndLockStatus.APPROVING_TOKEN)
          const response = await approveCallback()
          if (response?.hash) {
            const transactionReceipt = await waitForTransaction({ hash: response.hash })
            if (transactionReceipt?.status === 'success') {
              setStatus(ApproveAndLockStatus.LOCK_COMET)
              await write()
            } else {
              setStatus(ApproveAndLockStatus.ERROR)
            }
          }
          return
        }
        if (approvalState === ApprovalState.APPROVED) {
          await write()
          onDismiss?.()
        }
      } catch (error) {
        console.error(error)
        if (isUserRejected(error)) {
          handleCancel()
        }
      }
    },
    [approvalState, approveCallback, handleCancel, onDismiss, setStatus, setTxHash, waitForTransaction],
  )
}

export const useWriteApproveAndLockCallback = (onDismiss?: () => void) => {
  const withApprove = useWriteWithApproveCallback(onDismiss)
  const lockComet = useWriteLockCallback()

  return useCallback(async () => {
    // Log GA event before locking COMET
    logGTMClickLockCometEvent()

    await withApprove(lockComet)
  }, [withApprove, lockComet])
}

export const useWriteApproveAndIncreaseLockAmountCallback = (onDismiss?: () => void) => {
  const withApprove = useWriteWithApproveCallback(onDismiss)
  const increaseLockAmount = useWriteIncreaseLockAmountCallback()

  return useCallback(async () => {
    await withApprove(increaseLockAmount)
  }, [withApprove, increaseLockAmount])
}

