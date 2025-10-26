import { useVeCometContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, cometLockTxHashAtom, ApproveAndLockStatus } from 'state/Comet/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { zeroAddress } from 'viem'

// invoke the lock function on the Comet contract
export const useWriteWithdrawCallback = () => {
  const vecometContract = useVeCometContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cometLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const withdraw = useCallback(async () => {
    const { request } = await vecometContract.simulate.withdrawAll([zeroAddress], {
      account: account!,
      chain: vecometContract.chain,
    })

    setStatus(ApproveAndLockStatus.UNLOCK_COMET)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.UNLOCK_COMET_PENDING)
    if (hash) {
      const transactionReceipt = await waitForTransaction({ hash })
      if (transactionReceipt?.status === 'success') {
        setStatus(ApproveAndLockStatus.CONFIRMED)
      } else {
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [vecometContract, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return withdraw
}

