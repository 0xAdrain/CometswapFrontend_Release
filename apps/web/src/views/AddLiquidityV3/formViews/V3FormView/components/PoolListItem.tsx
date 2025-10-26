import { PositionDetails } from '@cometswap/farms'
import { useTranslation } from '@cometswap/localization'
import { Currency, Price, Token } from '@cometswap/sdk'
import { Position } from '@cometswap/v3-sdk'
import { Bound } from 'config/constants/types'
import { useToken } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'

export interface PositionListItemDisplayProps {
  positionSummaryLink: string
  currencyBase?: Currency
  currencyQuote?: Currency
  removed: boolean
  outOfRange: boolean
  priceUpper?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
  priceLower?: Price<Token, Token>
  feeAmount: number
  subtitle: string
  setInverted: Dispatch<SetStateAction<boolean>>
  position: Position | undefined
  isValidFee: boolean // 添加标识字段
}

interface PositionListItemProps {
  positionDetails: PositionDetails
  children: (displayProps: PositionListItemDisplayProps) => ReactNode
}

export default function PositionListItem({ positionDetails, children }: PositionListItemProps) {
  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    isValidFee = true, // 默认为true以保持向后兼容
  } = positionDetails

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [inverted, setInverted] = useState(false)

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    // 如果fee无效，不尝试创建Position对象，避免错误
    if (!isValidFee) {
      console.warn('Skipping Position creation for invalid fee:', { feeAmount, isValidFee })
      return undefined
    }
    
    if (pool) {
      try {
        return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
      } catch (error) {
        console.error('Failed to create V3 Position:', { 
          feeAmount, 
          tickLower, 
          tickUpper, 
          error: error instanceof Error ? error.message : String(error)
        })
        return undefined
      }
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper, feeAmount, isValidFee])

  // 只有在fee有效时才计算tickAtLimit，避免TICK_LOWER错误
  const tickAtLimit = useIsTickAtLimit(isValidFee ? feeAmount : undefined, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const positionSummaryLink = `/liquidity/${positionDetails.tokenId}`

  const removed = liquidity === 0n

  let subtitle = ''

  // 如果fee无效，显示警告信息
  if (!isValidFee) {
    subtitle = `⚠️ ${t('Invalid Pool')} - Fee: ${feeAmount} (${t('Non-standard fee rate, possibly created by script')})`
  } else if (priceUpper && priceLower && currencyBase && currencyQuote) {
    subtitle = `${t('Min %minAmount%', {
      minAmount: formatTickPrice(inverted ? priceUpper.invert() : priceLower, tickAtLimit, Bound.LOWER, locale),
    })} / ${t('Max %maxAmount%', {
      maxAmount: formatTickPrice(inverted ? priceLower.invert() : priceUpper, tickAtLimit, Bound.UPPER, locale),
    })} ${t('%assetA% per %assetB%', {
      assetA: inverted ? currencyBase?.symbol : currencyQuote?.symbol,
      assetB: inverted ? currencyQuote?.symbol : currencyBase?.symbol,
    })}`
  }

  return children({
    position,
    positionSummaryLink,
    currencyBase,
    currencyQuote,
    removed,
    outOfRange,
    priceUpper,
    tickAtLimit,
    priceLower,
    feeAmount,
    subtitle,
    setInverted,
    isValidFee,
  })
}

