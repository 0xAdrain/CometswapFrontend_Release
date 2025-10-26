import { useMasterchef, useV2SSBCometWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { bCometHarvestFarm, harvestFarm } from 'utils/calls'
import { Address } from 'viem'

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef()
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, farmPid, gasPrice)
  }, [farmPid, masterChefContract, gasPrice])

  return { onReward: handleHarvest }
}

export const useBCometHarvestFarm = (bCometWrapperAddress: Address) => {
  const V2SSBCometContract = useV2SSBCometWrapperContract(bCometWrapperAddress)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return bCometHarvestFarm(V2SSBCometContract, gasPrice)
  }, [V2SSBCometContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestFarm

