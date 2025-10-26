import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { useCallback, useMemo } from 'react'
import { useFarms } from 'state/farms/hooks'

export function useFarmV2Multiplier() {
  const { regularCometPerBlock, totalRegularAllocPoint } = useFarms()

  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalRegularAllocPoint) ? (+totalRegularAllocPoint / 10).toString() : '-'),
    [totalRegularAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmCometPerSecond: useCallback(
      (poolWeight?: BigNumber) => {
        const farmCometPerSecondNum =
          poolWeight && regularCometPerBlock ? poolWeight.times(regularCometPerBlock).dividedBy(BSC_BLOCK_TIME) : BIG_ZERO

        const farmCometPerSecond = farmCometPerSecondNum.isZero()
          ? '0'
          : farmCometPerSecondNum.lt(0.000001)
          ? '<0.000001'
          : `~${farmCometPerSecondNum.toFixed(6)}`
        return farmCometPerSecond
      },
      [regularCometPerBlock],
    ),
    getNumberFarmCometPerSecond: useCallback(
      (poolWeight?: BigNumber) => {
        const farmCometPerSecondNum =
          poolWeight && regularCometPerBlock ? poolWeight.times(regularCometPerBlock).dividedBy(BSC_BLOCK_TIME) : BIG_ZERO
        return farmCometPerSecondNum.toNumber()
      },
      [regularCometPerBlock],
    ),
  }
}

