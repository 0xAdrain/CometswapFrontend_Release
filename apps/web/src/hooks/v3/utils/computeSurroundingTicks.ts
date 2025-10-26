import { TickMath } from '@cometswap/v3-sdk'

export interface TickDataRaw {
  tick: number
  liquidityNet: string
  liquidityGross: string
}

export interface TickProcessed {
  tick: number
  liquidityNet: bigint
  liquidityGross: bigint
  liquidityActive: bigint
}

// Computes the numSurroundingTicks above or below the active tick.
export function computeSurroundingTicks(
  activeTickProcessed: TickProcessed,
  tickDataRaw: TickDataRaw[],
  pivot: number,
  ascending: boolean,
  numSurroundingTicks: number = 300
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  }

  // Iterate outwards (either up or down depending on 'ascending') from the active tick,
  // building active liquidity for each tick.
  let processedTicks: TickProcessed[] = []
  let tickIdx = pivot

  for (let i = 0; i < numSurroundingTicks; i++) {
    const currentTickData = tickDataRaw[tickIdx]
    
    if (!currentTickData) {
      break
    }

    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick: currentTickData.tick,
      liquidityNet: BigInt(currentTickData.liquidityNet),
      liquidityGross: BigInt(currentTickData.liquidityGross),
    }

    // Update the active liquidity.
    // If we are iterating ascending and we found an initialized tick we immediately apply
    // it to the current processed tick we are building.
    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
    if (ascending) {
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive + BigInt(currentTickData.liquidityNet)
    } else if (!ascending && previousTickProcessed.liquidityActive !== undefined) {
      // We are iterating descending, so look at the previous tick and apply any net liquidity.
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive - BigInt(previousTickProcessed.liquidityNet)
    }

    processedTicks.push(currentTickProcessed)
    previousTickProcessed = currentTickProcessed
    tickIdx = ascending ? tickIdx + 1 : tickIdx - 1
  }

  if (!ascending) {
    processedTicks = processedTicks.reverse()
  }

  return processedTicks
}

export function feeTierToTickSpacing(feeTier: number): number {
  switch (feeTier) {
    case 100:
      return 1
    case 500:
      return 10
    case 3000:
      return 60
    case 10000:
      return 200
    default:
      throw Error(`Tier ${feeTier} not supported.`)
  }
}

// Returns the closest tick that is nearest a given tick and usable for the given fee amount
export function nearestUsableTick(tick: number, tickSpacing: number) {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  
  if (rounded < TickMath.MIN_TICK) {
    return rounded + tickSpacing
  } else if (rounded > TickMath.MAX_TICK) {
    return rounded - tickSpacing
  } else {
    return rounded
  }
}