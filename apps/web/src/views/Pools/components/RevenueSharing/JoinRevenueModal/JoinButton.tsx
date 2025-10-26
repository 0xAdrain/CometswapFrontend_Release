import { useTranslation } from '@cometswap/localization'
import { Button, useToast } from '@cometswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVCometContract } from 'hooks/useContract'
import { useCallback } from 'react'

interface JoinButtonProps {
  refresh?: () => void
  onDismiss?: () => void
}

const JoinButton: React.FunctionComponent<React.PropsWithChildren<JoinButtonProps>> = ({ refresh, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { chainId } = useAccountActiveChain()
  const vCometContract = useVCometContract({ chainId })
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleJoinButton = useCallback(async () => {
    try {
      const receipt = await fetchWithCatchTxError(() => vCometContract.write.syncFromCometPool([] as any))

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Joined Revenue Sharing Pool.')}
          </ToastDescriptionWithTx>,
        )
        await refresh?.()
        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit vComet syncFromCometPool', error)
    }
  }, [fetchWithCatchTxError, onDismiss, refresh, t, toastSuccess, vCometContract.write])

  return (
    <Button width="100%" m="24px 0 8px 0" disabled={isPending} onClick={handleJoinButton}>
      {t('Update Staking Position')}
    </Button>
  )
}

export default JoinButton

