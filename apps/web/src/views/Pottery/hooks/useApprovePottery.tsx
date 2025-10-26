import { useTranslation } from '@cometswap/localization'
import { MaxUint256 } from '@cometswap/swap-sdk-core'
import { useToast } from '@cometswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVeComet } from 'hooks/useContract'
import { useCallback } from 'react'
import { Address } from 'viem'

export const useApprovePottery = (potteryVaultAddress: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const cakeContract = useVeComet()

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(cakeContract, 'approve', [potteryVaultAddress as Address, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [potteryVaultAddress, cakeContract, t, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, onApprove }
}

