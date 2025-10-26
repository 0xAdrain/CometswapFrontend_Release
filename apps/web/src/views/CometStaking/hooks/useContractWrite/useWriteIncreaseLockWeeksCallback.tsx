import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCometContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  ApproveAndLockStatus,
  approveAndLockStatusAtom,
  cometLockTxHashAtom,
  cometLockWeeksAtom,
} from 'state/Comet/atoms'
import { useLockCometData } from 'state/Comet/hooks'
import { logger } from 'utils/datadog'
import { logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { TransactionExecutionError } from 'viem'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'
import { useVeCometLockStatus } from '../useVeCometUserInfo'

export const useWriteIncreaseLockWeeksCallback = (onDismiss?: () => void) => {
  const { chainId } = useActiveChainId()
  const vecometContract = useVeCometContract()
  const { cakeUnlockTime, cometLockExpired } = useVeCometLockStatus()
  const { address: account } = useAccount()
  const { cometLockWeeks } = useLockCometData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cometLockTxHashAtom)
  const setCometLockWeeks = useSetAtom(cometLockWeeksAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(cometLockExpired ? undefined : Number(cakeUnlockTime))

  const increaseLockWeeks = useCallback(async () => {
    const week = Number(cometLockWeeks)
    if (!week || !roundedUnlockTimestamp || !account) return

    try {
      const { request } = await vecometContract.simulate.increaseUnlockTime([roundedUnlockTimestamp], {
        account: account!,
        chain: vecometContract.chain,
      })

      setStatus(ApproveAndLockStatus.INCREASE_WEEKS)

      const hash = await walletClient?.writeContract({
        ...request,
        account,
      })
      setTxHash(hash ?? '')
      setStatus(ApproveAndLockStatus.INCREASE_WEEKS_PENDING)
      if (hash) {
        const transactionReceipt = await waitForTransaction({ hash })
        logTx({ account, chainId: chainId!, hash })
        if (transactionReceipt?.status === 'success') {
          setCometLockWeeks('')
          setStatus(ApproveAndLockStatus.CONFIRMED)
          onDismiss?.()
        } else {
          setStatus(ApproveAndLockStatus.ERROR)
        }
      }
    } catch (error: any) {
      console.error('Failed to increase lock weeks', error)
      if (isUserRejected(error)) {
        setStatus(ApproveAndLockStatus.REJECT)
      } else {
        logger.warn(
          '[CometStaking]: Failed to increase lock weeks',
          {
            error: error instanceof TransactionExecutionError ? error.cause : undefined,
            account,
            chainId,
            cometLockWeeks,
            roundedUnlockTimestamp,
          },
          error,
        )
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [
    cometLockWeeks,
    roundedUnlockTimestamp,
    account,
    vecometContract.simulate,
    vecometContract.chain,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    chainId,
    setCometLockWeeks,
    onDismiss,
  ])

  return increaseLockWeeks
}

