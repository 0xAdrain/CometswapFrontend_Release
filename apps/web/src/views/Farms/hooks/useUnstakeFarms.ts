import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMasterchef, useCrossFarmingVault, useV2SSBCometWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCometUnStakeFarm, crossChainUnstakeFarm, unstakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { ChainId } from '@cometswap/chains'

const useUnstakeFarms = (pid?: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const { gasPrice: bnbGasPrice } = useFeeDataWithGasPrice(ChainId.BSC)
  const oraclePrice = useOraclePrice(chainId ?? 0)
  const masterChefContract = useMasterchef()
  const crossFarmingVaultContract = useCrossFarmingVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleUnstakeCrossChain = useCallback(
    async (amount: string) => {
      return crossChainUnstakeFarm(
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

  return { onUnstake: vaultPid ? handleUnstakeCrossChain : handleUnstake }
}

export const useBCometUnstakeFarms = (bCometWrapperAddress) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const V2SSBCometContract = useV2SSBCometWrapperContract(bCometWrapperAddress)

  const handleUnstake = useCallback(
    async (amount: string) => {
      return bCometUnStakeFarm(V2SSBCometContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT)
    },
    [V2SSBCometContract, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms

