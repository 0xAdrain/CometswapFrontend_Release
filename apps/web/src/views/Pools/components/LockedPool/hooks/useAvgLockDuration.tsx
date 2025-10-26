import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from '@cometswap/pools'
import BigNumber from 'bignumber.js'
import { useVeCometVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@cometswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

const ZERO = new BigNumber(0)
const ONE = new BigNumber(1)

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalCometInVault, pricePerFullShare } = useVeCometVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleCometAmount = totalCometInVault?.minus(totalLockedAmount || ZERO)
    const flexibleCometShares = flexibleCometAmount?.div(pricePerFullShare || ONE).times(DEFAULT_TOKEN_DECIMAL)
    const lockedCometBoostedShares = totalShares?.minus(flexibleCometShares || ZERO)
    const lockedCometOriginalShares = totalLockedAmount?.div(pricePerFullShare || ONE).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedCometBoostedShares?.div(lockedCometOriginalShares || ONE)

    return (
      Math.round(
        avgBoostRatio
          ?.minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber() ?? 0,
      ) || 0
    )
  }, [totalCometInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  const avgLockDurationsInWeeksNum = useMemo(
    () => secondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInWeeksNum,
    avgLockDurationsInSeconds,
  }
}

