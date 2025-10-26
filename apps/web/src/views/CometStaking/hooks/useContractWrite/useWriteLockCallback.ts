import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCometContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cometLockTxHashAtom } from 'state/Comet/atoms'
import { useLockCometData } from 'state/Comet/hooks'
import { calculateGasMargin } from 'utils'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'

// invoke the lock function on the Comet contract
export const useWriteLockCallback = () => {
  const vecometContract = useVeCometContract()
  const { address: account } = useAccount()
  const { cometLockAmount, cometLockWeeks } = useLockCometData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cometLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp()

  const lockComet = useCallback(async () => {
    const week = Number(cometLockWeeks)
    if (!week || !cometLockAmount || !roundedUnlockTimestamp) return

    const { request } = await vecometContract.simulate.createLock(
      [BigInt(getDecimalAmount(new BN(cometLockAmount), 18).toString()), roundedUnlockTimestamp],
      {
        account: account!,
        chain: vecometContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.LOCK_COMET)

    const hash = await walletClient?.writeContract({
      ...request,
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.LOCK_COMET_PENDING)
    if (hash) {
      const transactionReceipt = await waitForTransaction({ hash })
      if (transactionReceipt?.status === 'success') {
        setStatus(ApproveAndLockStatus.CONFIRMED)
      } else {
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [
    cometLockWeeks,
    cometLockAmount,
    roundedUnlockTimestamp,
    vecometContract.simulate,
    vecometContract.chain,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
  ])

  return lockComet
}

