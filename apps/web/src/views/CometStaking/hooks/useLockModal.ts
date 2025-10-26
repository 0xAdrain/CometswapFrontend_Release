import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cometLockApprovedAtom } from 'state/Comet/atoms'
import { useLockCometData } from 'state/Comet/hooks'
import { useLockApproveCallback } from './useLockAllowance'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const setStatus = useSetAtom(approveAndLockStatusAtom)

  const onDismiss = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
    setIsOpen(false)
  }, [setStatus])
  const onOpen = useCallback(() => setIsOpen(true), [])

  return {
    onDismiss,
    onOpen,
    isOpen,
    setIsOpen,
  }
}

export const useLockModal = () => {
  const modal = useModal()

  const lockCometData = useLockCometData()
  const { status, cometLockApproved, cometLockAmount } = lockCometData
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setCometLockApproved = useSetAtom(cometLockApprovedAtom)

  const { currentAllowance } = useLockApproveCallback(cometLockAmount)

  // when IDLE status, close modal
  useEffect(() => {
    if (modal.isOpen && status === ApproveAndLockStatus.IDLE) {
      modal.onDismiss()
    }
  }, [modal, modal.isOpen, setStatus, status])

  // on status change from IDLE, open modal
  useEffect(() => {
    if (!modal.isOpen && status !== ApproveAndLockStatus.IDLE) {
      modal.onOpen()
    }
  }, [modal, status])

  // when current allowance < lock amount, set approved to false
  useEffect(() => {
    if (!modal.isOpen) {
      const cometLockAmountBN = getDecimalAmount(new BN(cometLockAmount || 0)).toString()

      if (currentAllowance?.lessThan(cometLockAmountBN)) {
        setCometLockApproved(false)
      } else {
        setCometLockApproved(true)
      }
    }
  }, [cometLockApproved, cometLockAmount, setCometLockApproved, modal.isOpen, currentAllowance])

  return {
    modal,
    modalData: lockCometData,
  }
}

