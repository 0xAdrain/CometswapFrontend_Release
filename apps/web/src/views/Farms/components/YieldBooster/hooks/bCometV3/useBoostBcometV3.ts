import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useBCometFarmBoosterV3Contract } from 'hooks/useContract'
import { useCallback } from 'react'

export const useBoosterFarmV3Handlers = (tokenId: string, onDone: () => void) => {
  const farmBoosterV3Contract = useBCometFarmBoosterV3Contract()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const activate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterV3Contract, 'activate', [BigInt(tokenId)], { gas: BOOSTED_FARM_V3_GAS_LIMIT })
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [tokenId, farmBoosterV3Contract, callWithGasPrice, fetchWithCatchTxError, onDone])

  const deactivate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterV3Contract, 'deactive', [BigInt(tokenId)], { gas: BOOSTED_FARM_V3_GAS_LIMIT })
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [tokenId, farmBoosterV3Contract, callWithGasPrice, fetchWithCatchTxError, onDone])

  return { activate, deactivate, isConfirming }
}

