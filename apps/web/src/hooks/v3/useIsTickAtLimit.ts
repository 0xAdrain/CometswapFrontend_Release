import { Bound } from 'config/constants/types'
import { useMemo } from 'react'

export function useIsTickAtLimit(
  feeAmount: number | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  return useMemo(() => {
    if (!feeAmount || tickLower === undefined || tickUpper === undefined) {
      return {
        [Bound.LOWER]: false,
        [Bound.UPPER]: false,
      }
    }

    // Get tick spacing based on fee amount
    const getTickSpacing = (fee: number) => {
      switch (fee) {
        case 100:
          return 1
        case 500:
          return 10
        case 3000:
          return 60
        case 10000:
          return 200
        default:
          return 60
      }
    }

    const tickSpacing = getTickSpacing(feeAmount)
    
    // Calculate min and max ticks
    const MIN_TICK = -887272
    const MAX_TICK = 887272
    
    // Ensure ticks are aligned to tick spacing
    const minTick = Math.ceil(MIN_TICK / tickSpacing) * tickSpacing
    const maxTick = Math.floor(MAX_TICK / tickSpacing) * tickSpacing

    return {
      [Bound.LOWER]: tickLower <= minTick,
      [Bound.UPPER]: tickUpper >= maxTick,
    }
  }, [feeAmount, tickLower, tickUpper])
}