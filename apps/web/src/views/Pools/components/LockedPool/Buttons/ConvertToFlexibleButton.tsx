import { useTranslation } from '@cometswap/localization'
import { Button, ButtonProps, useToast } from '@cometswap/uikit'
import { memo, useCallback } from 'react'

import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVaultPoolContract } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchCometVaultUserData } from 'state/pools'
import { VaultKey } from 'state/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useQueryClient } from '@tanstack/react-query'

const ConvertToFlexibleButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CometVault)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()

  const handleUnlock = useCallback(async () => {
    if (!account || !chainId) return
    const callOptions = {
      gas: vaultPoolConfig[VaultKey.CometVault].gasLimit,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account] as const
      return callWithGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCometVaultUserData({ account, chainId }))
      queryClient.invalidateQueries({
        queryKey: ['userCometLockStatus', account],
      })
    }
  }, [
    t,
    toastSuccess,
    account,
    callWithGasPrice,
    dispatch,
    fetchWithCatchTxError,
    vaultPoolContract,
    queryClient,
    chainId,
  ])

  return (
    <Button width="100%" disabled={pendingTx} onClick={handleUnlock} variant="secondary" {...props}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConvertToFlexibleButton)

