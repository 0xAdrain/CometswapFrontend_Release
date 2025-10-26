import isUndefinedOrNull from '@cometswap/utils/isUndefinedOrNull'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCometFarmBoosterContract } from 'hooks/useContract'
import { useReadContract } from '@cometswap/wagmi'
import { useCallback } from 'react'
import { useFarmUser } from 'state/farms/hooks'
import { useBCometProxyContractAddress } from 'hooks/useBCometProxyContractAddress'
import { useUserBoosterStatus } from 'views/Farms/hooks/useUserBoosterStatus'
import { useUserLockedCometStatus } from 'views/Farms/hooks/useUserLockedCometStatus'

export enum YieldBoosterState {
  UNCONNECTED,
  NO_LOCKED,
  LOCKED_END,
  NO_PROXY_CREATED,
  NO_MIGRATE,
  NO_LP,
  DEACTIVE,
  ACTIVE,
  ACTIVE_AND_NO_LP,
  MAX,
}

function useIsPoolActive(pid: number) {
  const farmBoosterContract = useBCometFarmBoosterContract()
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useReadContract({
    abi: farmBoosterContract.abi,
    address: farmBoosterContract.address,
    functionName: 'isBoostedPool',
    args: [account!, BigInt(pid)],
    query: {
      enabled: !!account,
    },
    chainId,
    watch: true,
  })

  return {
    isActivePool: data,
    refreshIsPoolActive: refetch,
  }
}

interface UseYieldBoosterStateArgs {
  farmPid: number
}

export default function useYieldBoosterState(yieldBoosterStateArgs: UseYieldBoosterStateArgs) {
  const { farmPid } = yieldBoosterStateArgs
  const { account, chainId } = useAccountActiveChain()
  const { remainingCounts, refreshActivePools } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedCometStatus()
  const { stakedBalance, proxy } = useFarmUser(farmPid)
  const { isActivePool, refreshIsPoolActive } = useIsPoolActive(farmPid)
  const { proxyCreated, refreshProxyAddress, proxyAddress } = useBCometProxyContractAddress(account, chainId)

  const refreshActivePool = useCallback(() => {
    refreshActivePools()
    refreshIsPoolActive()
  }, [refreshActivePools, refreshIsPoolActive])

  let state: YieldBoosterState

  if (!account || isUndefinedOrNull(locked)) {
    state = YieldBoosterState.UNCONNECTED
  } else if (!locked && stakedBalance.eq(0)) {
    // NOTE: depend on useCometVaultUserData in Farm Component to check state
    state = YieldBoosterState.NO_LOCKED
  } else if (!proxyCreated) {
    state = YieldBoosterState.NO_PROXY_CREATED
  } else if (stakedBalance.gt(0)) {
    state = YieldBoosterState.NO_MIGRATE
  } else if (lockedEnd && (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000))) {
    // NOTE: duplicate logic in BCometBoosterCard
    state = YieldBoosterState.LOCKED_END
  } else if (!isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.NO_LP
  } else if (!isActivePool && remainingCounts === 0) {
    state = YieldBoosterState.MAX
  } else if (isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.ACTIVE_AND_NO_LP
  } else if (isActivePool) {
    state = YieldBoosterState.ACTIVE
  } else {
    state = YieldBoosterState.DEACTIVE
  }

  return {
    state,
    shouldUseProxyFarm: Boolean(proxyCreated && stakedBalance.eq(0)),
    refreshActivePool,
    refreshProxyAddress,
    proxyAddress,
  }
}

