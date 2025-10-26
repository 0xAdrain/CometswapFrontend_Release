import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCometContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cometLockTxHashAtom } from 'state/Comet/atoms'
import { useLockCometData } from 'state/Comet/hooks'
import { logger } from 'utils/datadog'
import { logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { TransactionExecutionError } from 'viem'
import { useAccount, useWalletClient } from 'wagmi'

export const useWriteIncreaseLockAmountCallback = () => {
  const { chainId } = useActiveChainId()
  const vecometContract = useVeCometContract()
  const { address: account } = useAccount()
  const { cometLockAmount } = useLockCometData()
  const setTxHash = useSetAtom(cometLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const increaseLockAmount = useCallback(async () => {
    if (!account || !cometLockAmount) return

    const { request } = await vecometContract.simulate.increaseLockAmount(
      [BigInt(getDecimalAmount(new BN(cometLockAmount), 18).toString())],
      {
        account: account!,
        chain: vecometContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT)

    try {
      const hash = await walletClient?.writeContract({
        ...request,
        account,
      })
      setTxHash(hash ?? '')
      setStatus(ApproveAndLockStatus.INCREASE_AMOUNT_PENDING)
      if (hash) {
        const transactionReceipt = await waitForTransaction({ hash })
        logTx({ account, chainId: chainId!, hash })
        if (transactionReceipt?.status === 'success') {
          setStatus(ApproveAndLockStatus.CONFIRMED)
        } else {
          setStatus(ApproveAndLockStatus.ERROR)
        }
      }
    } catch (error: any) {
      if (!isUserRejected(error)) {
        logger.warn(
          '[CometStaking]: Failed to increase lock amount',
          {
            error: error instanceof TransactionExecutionError ? error.cause : error,
            account,
            chainId,
          },
          error,
        )
      }
      throw error
    }
  }, [
    account,
    cometLockAmount,
    vecometContract.simulate,
    vecometContract.chain,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    chainId,
  ])

  return increaseLockAmount
}

