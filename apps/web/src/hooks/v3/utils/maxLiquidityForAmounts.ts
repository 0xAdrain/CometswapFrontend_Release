import { BigintIsh } from '@cometswap/sdk'
import { Q96, TickMath } from '@cometswap/v3-sdk'

/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */
export function maxLiquidityForAmounts(
  sqrtRatioCurrentX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: BigintIsh,
  amount1: BigintIsh,
  useFullPrecision: boolean
): bigint {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }

  const maxLiquidityForAmount0 = maxLiquidityForAmount0Imprecise(sqrtRatioCurrentX96, sqrtRatioBX96, amount0)
  const maxLiquidityForAmount1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1)

  if (sqrtRatioCurrentX96 <= sqrtRatioAX96) {
    return maxLiquidityForAmount0
  } else if (sqrtRatioCurrentX96 < sqrtRatioBX96) {
    return maxLiquidityForAmount0 < maxLiquidityForAmount1 ? maxLiquidityForAmount0 : maxLiquidityForAmount1
  } else {
    return maxLiquidityForAmount1
  }
}

/**
 * Computes the amount of liquidity received for a given amount of token0 and price range
 * @param sqrtRatioAX96 A sqrt price
 * @param sqrtRatioBX96 Another sqrt price
 * @param amount0 The amount0 being sent in
 */
function maxLiquidityForAmount0Imprecise(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, amount0: BigintIsh): bigint {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }
  const intermediate = (sqrtRatioAX96 * sqrtRatioBX96) / Q96
  return (BigInt(amount0) * intermediate) / (sqrtRatioBX96 - sqrtRatioAX96)
}

/**
 * Computes the amount of liquidity received for a given amount of token1 and price range
 * @param sqrtRatioAX96 A sqrt price
 * @param sqrtRatioBX96 Another sqrt price
 * @param amount1 The amount1 being sent in
 */
function maxLiquidityForAmount1(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, amount1: BigintIsh): bigint {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }
  return (BigInt(amount1) * Q96) / (sqrtRatioBX96 - sqrtRatioAX96)
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given fee amount
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
export function nearestUsableTick(tick: number, tickSpacing: number): number {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  
  if (rounded < TickMath.MIN_TICK) {
    return rounded + tickSpacing
  } else if (rounded > TickMath.MAX_TICK) {
    return rounded - tickSpacing
  } else {
    return rounded
  }
}




