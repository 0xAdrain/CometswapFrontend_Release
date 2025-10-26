import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useCometVaultPublicData, useCometVaultUserData } from 'state/pools/hooks'
import { getBCometMultiplier } from 'views/Farms/components/YieldBooster/components/BCometCalculator'
import { useUserLockedCometStatus } from 'views/Farms/hooks/useUserLockedCometStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToDays } from 'views/Pools/components/utils/formatSecondsToWeeks'
import useFarmBoosterConstants from './useFarmBoosterConstants'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTokenStakedAmount: BigNumber) => {
  useCometVaultPublicData()
  useCometVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedCometStatus()
  const { constants, isLoading: isFarmConstantsLoading } = useFarmBoosterConstants()
  const bCometMultiplier = useMemo(() => {
    const result =
      !isLoading && !isFarmConstantsLoading && lockedAmount && totalLockedAmount
        ? getBCometMultiplier(
            userBalanceInFarm, // userBalanceInFarm,
            lockedAmount, // userLockAmount
            secondsToDays(_toNumber(lockedEnd) - _toNumber(lockedStart)), // userLockDuration
            totalLockedAmount, // totalLockAmount
            lpTokenStakedAmount, // lpBalanceOfFarm
            avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
            constants?.cA ?? 1,
            constants?.cB ?? 1,
          )
        : null
    return !result || result.toString() === 'NaN' ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    lockedEnd,
    lockedStart,
    isLoading,
    isFarmConstantsLoading,
    constants,
  ])
  return _toNumber(bCometMultiplier)
}

export const useGetCalculatorMultiplier = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  lockedAmount: BigNumber,
  userLockDuration: number,
) => {
  useCometVaultPublicData()
  useCometVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, totalLockedAmount } = useUserLockedCometStatus()
  const { constants, isLoading: isFarmConstantsLoading } = useFarmBoosterConstants()
  const bCometMultiplier = useMemo(() => {
    const result =
      !isLoading && !isFarmConstantsLoading && lockedAmount && totalLockedAmount
        ? getBCometMultiplier(
            userBalanceInFarm, // userBalanceInFarm,
            lockedAmount, // userLockAmount
            secondsToDays(userLockDuration), // userLockDuration
            totalLockedAmount, // totalLockAmount
            lpTokenStakedAmount, // lpBalanceOfFarm
            avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration,
            constants?.cA ?? 1,
            constants?.cB ?? 1,
          )
        : null
    return !result || result.toString() === 'NaN' ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    isLoading,
    isFarmConstantsLoading,
    userLockDuration,
    constants,
  ])
  return _toNumber(bCometMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bCometMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  return (apr * bCometMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR

