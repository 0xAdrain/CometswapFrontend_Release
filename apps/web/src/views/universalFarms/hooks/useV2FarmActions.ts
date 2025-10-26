import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useV2SSBCometWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCometHarvestFarm, bCometStakeFarm, bCometUnStakeFarm } from 'utils/calls'
import { Address, maxUint256, zeroAddress } from 'viem'

export const useV2FarmActions = (lpAddress: Address, bCometWrapperAddress?: Address) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const V2SSBCometContract = useV2SSBCometWrapperContract(bCometWrapperAddress ?? zeroAddress)

  const onStake = useCallback(
    async (amount: string) => bCometStakeFarm(V2SSBCometContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT),
    [V2SSBCometContract, gasPrice],
  )

  const onUnStake = useCallback(
    async (amount: string) => bCometUnStakeFarm(V2SSBCometContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT),
    [V2SSBCometContract, gasPrice],
  )

  const onHarvest = useCallback(async () => {
    return bCometHarvestFarm(V2SSBCometContract, gasPrice)
  }, [V2SSBCometContract, gasPrice])

  const { callWithGasPrice } = useCallWithGasPrice()
  const lpContract = useERC20(lpAddress)
  const onApprove = useCallback(async () => {
    if (!bCometWrapperAddress) return Promise.resolve()

    return callWithGasPrice(lpContract, 'approve', [bCometWrapperAddress, maxUint256])
  }, [bCometWrapperAddress, callWithGasPrice, lpContract])

  return {
    onStake,
    onUnStake,
    onHarvest,
    onApprove,
  }
}

