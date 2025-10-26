import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMasterchef, useCrossFarmingVault, useV2SSBCometWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCometStakeFarm, crossChainStakeFarm, stakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { ChainId } from '@cometswap/chains'

const useStakeFarms = (pid: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const { gasPrice: bnbGasPrice } = useFeeDataWithGasPrice(ChainId.BSC)

  const oraclePrice = useOraclePrice(chainId ?? 0)
  const masterChefContract = useMasterchef()
  const crossFarmingVaultContract = useCrossFarmingVault()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleStakeCrossChain = useCallback(
    async (amount: string) => {
      return crossChainStakeFarm(
        crossFarmingVaultContract,
        vaultPid,
        amount,
        bnbGasPrice,
        account,
        oraclePrice,
        chainId,
      )
    },
    [crossFarmingVaultContract, vaultPid, bnbGasPrice, account, oraclePrice, chainId],
  )

  return { onStake: vaultPid ? handleStakeCrossChain : handleStake }
}

export const useBCometStakeFarms = (bCometWrapperAddress) => {
  const { gasPrice } = useFeeDataWithGasPrice()

  const V2SSBCometContract = useV2SSBCometWrapperContract(bCometWrapperAddress)

  const handleStake = useCallback(
    async (amount: string) => {
      return bCometStakeFarm(V2SSBCometContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT)
    },
    [V2SSBCometContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakeFarms

