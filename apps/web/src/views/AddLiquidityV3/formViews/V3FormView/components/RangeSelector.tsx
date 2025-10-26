import { useTranslation } from '@cometswap/localization'
import { AutoColumn, Button, FlexGap, RowBetween, Text } from '@cometswap/uikit'
import { Currency } from '@cometswap/sdk'
import { FeeAmount, nearestUsableTick, TICK_SPACINGS, tickToPrice } from '@cometswap/v3-sdk'
import { useMemo } from 'react'
import { Bound } from 'config/constants/types'
import { StyledInput } from '@cometswap/widgets-internal'
import { LockIcon } from './LockIcon'

interface RangeSelectorProps {
  priceLower?: Price<Currency, Currency>
  priceUpper?: Price<Currency, Currency>
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  getDecrementLower: () => string
  getIncrementLower: () => string
  getDecrementUpper: () => string
  getIncrementUpper: () => string
  currencyA?: Currency | null
  currencyB?: Currency | null
  feeAmount?: FeeAmount
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}

const getTickToPrice = (tick: number, currencyA?: Currency | null, currencyB?: Currency | null) => {
  if (!currencyA || !currencyB) {
    return undefined
  }
  return tickToPrice(currencyA, currencyB, tick)
}

const priceToClosestTick = (price: Price<Currency, Currency>): number => {
  return nearestUsableTick(price.quotient, TICK_SPACINGS[FeeAmount.MEDIUM])
}

export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
}: RangeSelectorProps) {
  const { t } = useTranslation()

  const isSorted = currencyA && currencyB && currencyA.wrapped.sortsBefore(currencyB.wrapped)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount && getTickToPrice(-887272, currencyA, currencyB),
      [Bound.UPPER]: feeAmount && getTickToPrice(887272, currencyA, currencyB),
    }),
    [currencyA, currencyB, feeAmount],
  )

  const leftValue = useMemo(() => {
    return leftPrice?.toSignificant(5) ?? ''
  }, [leftPrice])

  const rightValue = useMemo(() => {
    if (ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return 'Infinity'

    if (
      tickSpaceLimits?.[Bound.LOWER] !== undefined &&
      rightPrice &&
      priceToClosestTick(rightPrice) <= tickSpaceLimits[Bound.LOWER]
    ) {
      return '0'
    }

    if (
      tickSpaceLimits?.[Bound.UPPER] !== undefined &&
      rightPrice &&
      priceToClosestTick(rightPrice) >= tickSpaceLimits[Bound.UPPER]
    ) {
      return 'Infinity'
    }

    return rightPrice?.toSignificant(5) ?? ''
  }, [isSorted, rightPrice, tickSpaceLimits, ticksAtLimit])

  return (
    <FlexGap gap="16px" width="100%">
      <AutoColumn gap="8px" style={{ flex: '1' }}>
        <RowBetween>
          <Text fontSize="12px" textTransform="uppercase" color="secondary" fontWeight={600}>
            {t('Min Price')}
          </Text>
          <LockIcon locked={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]} />
        </RowBetween>
        <RowBetween>
          <Button
            onClick={getDecrementLower}
            variant="secondary"
            scale="sm"
            disabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
          >
            -
          </Button>
          <StyledInput
            value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftValue}
            onUserInput={onLeftRangeInput}
            width="100%"
            placeholder="0.00"
            disabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
          />
          <Button
            onClick={getIncrementLower}
            variant="secondary"
            scale="sm"
            disabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
          >
            +
          </Button>
        </RowBetween>
      </AutoColumn>

      <AutoColumn gap="8px" style={{ flex: '1' }}>
        <RowBetween>
          <Text fontSize="12px" textTransform="uppercase" color="secondary" fontWeight={600}>
            {t('Max Price')}
          </Text>
          <LockIcon locked={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]} />
        </RowBetween>
        <RowBetween>
          <Button
            onClick={getDecrementUpper}
            variant="secondary"
            scale="sm"
            disabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
          >
            -
          </Button>
          <StyledInput
            value={rightValue}
            onUserInput={onRightRangeInput}
            width="100%"
            placeholder="0.00"
            disabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
          />
          <Button
            onClick={getIncrementUpper}
            variant="secondary"
            scale="sm"
            disabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
          >
            +
          </Button>
        </RowBetween>
      </AutoColumn>
    </FlexGap>
  )
}