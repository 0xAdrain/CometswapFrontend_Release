import { Currency, CurrencyAmount, Price } from '@cometswap/sdk'
import { FeeAmount, Pool, Position, TICK_SPACINGS, TickMath, encodeSqrtRatioX96, nearestUsableTick } from '@cometswap/v3-sdk'
import { Bound } from 'config/constants/types'
import { useMemo } from 'react'
import tryParseCurrencyAmount from 'utils/tryParseCurrencyAmount'
import { usePool } from './usePools'

export interface V3DerivedInfo {
  pool?: Pool | null
  poolState: 'LOADING' | 'NOT_EXISTS' | 'EXISTS' | 'INVALID'
  ticks: { [bound in Bound]?: number | undefined }
  price?: Price<Currency, Currency>
  pricesAtTicks: {
    [bound in Bound]?: Price<Currency, Currency> | undefined
  }
  currencies: { [field in 'CURRENCY_A' | 'CURRENCY_B']?: Currency }
  currencyBalances: { [field in 'CURRENCY_A' | 'CURRENCY_B']?: CurrencyAmount<Currency> }
  dependentField: 'CURRENCY_A' | 'CURRENCY_B'
  parsedAmounts: {
    [field in 'CURRENCY_A' | 'CURRENCY_B']?: CurrencyAmount<Currency>
  }
  position: Position | undefined
  noLiquidity?: boolean
  errorMessage?: string
  invalidPool: boolean
  outOfRange: boolean
  invalidRange: boolean
  depositADisabled: boolean
  depositBDisabled: boolean
  invertPrice: boolean
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}

export function useV3DerivedInfo(
  currencyA?: Currency,
  currencyB?: Currency,
  feeAmount?: FeeAmount,
  baseCurrency?: Currency,
  existingPosition?: Position,
  typedValue?: string,
  independentField?: 'CURRENCY_A' | 'CURRENCY_B',
  leftRangeTypedValue?: string,
  rightRangeTypedValue?: string
): V3DerivedInfo {
  const dependentField = independentField === 'CURRENCY_A' ? 'CURRENCY_B' : 'CURRENCY_A'

  // currencies
  const currencies: { [field in 'CURRENCY_A' | 'CURRENCY_B']?: Currency } = useMemo(
    () => ({
      CURRENCY_A: currencyA,
      CURRENCY_B: currencyB,
    }),
    [currencyA, currencyB]
  )

  // pool
  const [poolState, pool] = usePool(currencies.CURRENCY_A, currencies.CURRENCY_B, feeAmount)

  const noLiquidity = poolState === 'NOT_EXISTS'

  // note to parse inputs in reverse
  const invertPrice = Boolean(baseCurrency && baseCurrency.equals(currencies.CURRENCY_B))

  // always returns the price with 0 < price < 1
  const price: Price<Currency, Currency> | undefined = useMemo(() => {
    if (!pool || !currencies.CURRENCY_A || !currencies.CURRENCY_B) return undefined

    return invertPrice ? pool.priceOf(currencies.CURRENCY_B) : pool.priceOf(currencies.CURRENCY_A)
  }, [pool, currencies.CURRENCY_A, currencies.CURRENCY_B, invertPrice])

  // check for invalid price input (converts to invalid ratio)
  const invalidPrice = useMemo(() => {
    const sqrtRatioX96 = price ? encodeSqrtRatioX96(price.numerator, price.denominator) : undefined
    return (
      price &&
      sqrtRatioX96 &&
      !(
        sqrtRatioX96 >= TickMath.MIN_SQRT_RATIO &&
        sqrtRatioX96 < TickMath.MAX_SQRT_RATIO &&
        sqrtRatioX96 !== 0n
      )
    )
  }, [price])

  // used for warning states
  const invalidPool = poolState === 'INVALID'

  // lower and upper limits in the tick space for `feeAmount`
  const tickSpaceLimits: {
    [bound in Bound]: number | undefined
  } = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]) : undefined,
      [Bound.UPPER]: feeAmount ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]) : undefined,
    }),
    [feeAmount]
  )

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const ticks: {
    [key: string]: number | undefined
  } = useMemo(() => {
    return {
      [Bound.LOWER]:
        (invertPrice && typeof rightRangeTypedValue === 'string'
          ? parseFloat(rightRangeTypedValue)
          : typeof leftRangeTypedValue === 'string'
          ? parseFloat(leftRangeTypedValue)
          : undefined) ?? undefined,
      [Bound.UPPER]:
        (invertPrice && typeof leftRangeTypedValue === 'string'
          ? parseFloat(leftRangeTypedValue)
          : typeof rightRangeTypedValue === 'string'
          ? parseFloat(rightRangeTypedValue)
          : undefined) ?? undefined,
    }
  }, [leftRangeTypedValue, rightRangeTypedValue, invertPrice])

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {}

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount && tickLower ? tickLower === tickSpaceLimits[Bound.LOWER] : undefined,
      [Bound.UPPER]: feeAmount && tickUpper ? tickUpper === tickSpaceLimits[Bound.UPPER] : undefined,
    }),
    [tickSpaceLimits, tickLower, tickUpper, feeAmount]
  )

  // mark invalid range
  const invalidRange = Boolean(typeof tickLower === 'number' && typeof tickUpper === 'number' && tickLower >= tickUpper)

  // always returns the price with 0 < price < 1
  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]:
        typeof tickLower === 'number' && currencies.CURRENCY_A && currencies.CURRENCY_B
          ? tickToPrice(currencies.CURRENCY_A, currencies.CURRENCY_B, tickLower)
          : undefined,
      [Bound.UPPER]:
        typeof tickUpper === 'number' && currencies.CURRENCY_A && currencies.CURRENCY_B
          ? tickToPrice(currencies.CURRENCY_A, currencies.CURRENCY_B, tickUpper)
          : undefined,
    }
  }, [currencies.CURRENCY_A, currencies.CURRENCY_B, tickLower, tickUpper])

  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } = pricesAtTicks

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lessThan(lowerPrice) || price.greaterThan(upperPrice))
  )

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined = tryParseCurrencyAmount(
    typedValue,
    currencies[independentField]
  )

  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped
    const dependentCurrency = dependentField === 'CURRENCY_B' ? currencyB : currencyA
    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      pool &&
      price &&
      dependentCurrency &&
      !invalidRange
    ) {
      // calculate dependent amount
      return dependentCurrency.isNative
        ? CurrencyAmount.fromRawAmount(dependentCurrency, 0)
        : CurrencyAmount.fromRawAmount(dependentCurrency.wrapped, 0)
    }

    return undefined
  }, [
    independentAmount,
    dependentField,
    currencyA,
    currencyB,
    tickLower,
    tickUpper,
    pool,
    price,
    invalidRange,
  ])

  const parsedAmounts: {
    [field in 'CURRENCY_A' | 'CURRENCY_B']?: CurrencyAmount<Currency>
  } = useMemo(() => {
    return {
      [independentField]: independentAmount,
      [dependentField]: dependentAmount,
    }
  }, [dependentField, dependentAmount, independentField, independentAmount])

  // single deposit only if price is out of range
  const depositADisabled = Boolean(
    typeof tickUpper === 'number' && pool && price && price.greaterThan(pricesAtTicks[Bound.UPPER]!)
  )
  const depositBDisabled = Boolean(
    typeof tickLower === 'number' && pool && price && price.lessThan(pricesAtTicks[Bound.LOWER]!)
  )

  // create position entity based on users selection
  const position: Position | undefined = useMemo(() => {
    if (
      !pool ||
      !currencies.CURRENCY_A ||
      !currencies.CURRENCY_B ||
      typeof tickLower !== 'number' ||
      typeof tickUpper !== 'number' ||
      invalidRange
    ) {
      return undefined
    }

    // mark as 0 if disabled because out of range
    const amount0 = !depositADisabled
      ? parsedAmounts?.[currencies.CURRENCY_A.equals(pool.token0) ? 'CURRENCY_A' : 'CURRENCY_B']?.quotient
      : 0n
    const amount1 = !depositBDisabled
      ? parsedAmounts?.[currencies.CURRENCY_A.equals(pool.token0) ? 'CURRENCY_B' : 'CURRENCY_A']?.quotient
      : 0n

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool,
        tickLower,
        tickUpper,
        amount0: amount0.toString(),
        amount1: amount1.toString(),
        useFullPrecision: true, // we want full precision for the theoretical position
      })
    }

    return undefined
  }, [
    parsedAmounts,
    pool,
    currencies.CURRENCY_A,
    currencies.CURRENCY_B,
    tickLower,
    tickUpper,
    depositADisabled,
    depositBDisabled,
    invalidRange,
  ])

  let errorMessage: string | undefined
  if (!currencies.CURRENCY_A || !currencies.CURRENCY_B) {
    errorMessage = 'Select a token'
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? 'Invalid price input'
  }

  if (
    (!parsedAmounts.CURRENCY_A && !depositADisabled) ||
    (!parsedAmounts.CURRENCY_B && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? 'Enter an amount'
  }

  const currencyBalances = {
    CURRENCY_A: undefined,
    CURRENCY_B: undefined,
  }

  return {
    dependentField,
    currencies,
    pool,
    poolState,
    currencyBalances,
    parsedAmounts,
    ticks,
    price,
    pricesAtTicks,
    position,
    noLiquidity,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  }
}

// Helper function to convert tick to price
function tickToPrice(baseToken?: Currency, quoteToken?: Currency, tick?: number): Price<Currency, Currency> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }

  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick)
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96

  return baseToken.wrapped.sortsBefore(quoteToken.wrapped)
    ? new Price(baseToken, quoteToken, 2n ** 192n, ratioX192)
    : new Price(baseToken, quoteToken, ratioX192, 2n ** 192n)
}
