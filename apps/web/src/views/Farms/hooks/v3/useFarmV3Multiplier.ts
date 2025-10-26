import { useCallback, useMemo } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'

export function useFarmV3Multiplier() {
  const { data: farmV3 } = useFarmsV3Public()
  const { totalAllocPoint, cakePerSecond } = farmV3
  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalAllocPoint) ? (+totalAllocPoint / 10).toString() : '-'),
    [totalAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmCometPerSecond: useCallback(
      (poolWeight?: string) => {
        const farmCometPerSecondNum = poolWeight && cakePerSecond ? Number(poolWeight) * Number(cakePerSecond) : 0
        return farmCometPerSecondNum === 0
          ? '0'
          : farmCometPerSecondNum < 0.000001
          ? '<0.000001'
          : `~${farmCometPerSecondNum.toFixed(6)}`
      },
      [cakePerSecond],
    ),
  }
}

