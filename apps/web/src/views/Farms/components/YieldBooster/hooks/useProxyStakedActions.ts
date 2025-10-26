import { BOOSTED_FARM_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCometProxyContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useGasPrice } from 'state/user/hooks'
import { MasterChefContractType, harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { useBCometProxyContractAddress } from 'hooks/useBCometProxyContractAddress'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyCOMETBalance from './useProxyCOMETBalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBCometProxyContractAddress(account, chainId)
  const bCometProxy = useBCometProxyContract(proxyAddress) as unknown as MasterChefContractType
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyCometBalance, refreshProxyCometBalance } = useProxyCOMETBalance()

  const onDone = useCallback(() => {
    if (!account || !chainId) return
    refreshProxyCometBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyCometBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback(
    (value) => stakeFarm(bCometProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCometProxy, pid, gasPrice],
  )

  const onUnstake = useCallback(
    (value) => unstakeFarm(bCometProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCometProxy, pid, gasPrice],
  )

  const onReward = useCallback(
    () => harvestFarm(bCometProxy, pid, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bCometProxy, pid, gasPrice],
  )

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyCometBalance,
  }
}

