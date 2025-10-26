import { useTranslation } from '@cometswap/localization'
import { useToast } from '@cometswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useV2SSBCometWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchBCometWrapperUserDataAsync } from 'state/farms'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCometStakeFarm } from 'utils/calls'
import { Address } from 'viem'

import useCatchTxError from 'hooks/useCatchTxError'

export const useUpdateBCometFarms = (bCometWrapperAddress: Address, pid: number) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { toastSuccess } = useToast()
  const V2SSBCometContract = useV2SSBCometWrapperContract(bCometWrapperAddress)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchBCometWrapperUserDataAsync({ account, pids: [pid], chainId }))
    }
  }, [account, chainId, dispatch, pid])
  const handleStake = useCallback(async () => {
    const noHarvest = true
    const Tx = await bCometStakeFarm(V2SSBCometContract, '0', gasPrice, BOOSTED_FARM_V3_GAS_LIMIT, noHarvest)
    return Tx
  }, [V2SSBCometContract, gasPrice])

  const updateBCometMultiplier = async () => {
    const receipt = await fetchWithCatchTxError(() => handleStake())
    if (receipt?.status) {
      toastSuccess(
        `${t('Updated')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your bComet booster have been updated')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  return { onUpdate: updateBCometMultiplier }
}

