import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

import { useIfUserLocked } from './useStakedPools'

export default function useIsBoost({ minBoostAmount, boostDayPercent }) {
  const { locked, amount: lockedCometAmount } = useIfUserLocked()

  return Boolean(
    boostDayPercent > 0 &&
      locked &&
      lockedCometAmount.gte(getBalanceAmount(new BigNumber(minBoostAmount || ('0' as unknown as BigNumber.Value)))),
  )
}

