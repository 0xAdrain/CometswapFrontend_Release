import { unwrappedToken } from '@cometswap/tokens'
import { Position } from '@cometswap/v3-sdk'
import { useTokenByChainId } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePoolByChainId } from 'hooks/v3/usePools'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useMemo } from 'react'
import { PositionDetail } from '../type'

// @todo @ChefJerry consider merge to useAccountV3Positions
export const useExtraV3PositionInfo = (positionDetail?: PositionDetail) => {
  const chainId = positionDetail?.chainId
  const token0 = useTokenByChainId(positionDetail?.token0, chainId)
  const token1 = useTokenByChainId(positionDetail?.token1, chainId)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [, pool] = usePoolByChainId(currency0 ?? undefined, currency1 ?? undefined, positionDetail?.fee as number)

  const position = useMemo(() => {
    if (pool && positionDetail) {
      // 验证fee和tick值的有效性，避免TICK_LOWER/TICK_UPPER错误
      const validFeeAmounts = [100, 500, 2500, 10000]
      const isValidFeeAmount = positionDetail.fee && validFeeAmounts.includes(positionDetail.fee)
      
      if (!isValidFeeAmount) {
        console.warn('Skipping Position creation for invalid fee in useExtraV3PositionInfo:', { 
          fee: positionDetail.fee,
          tokenId: positionDetail.tokenId?.toString() 
        })
        return undefined
      }
      
      // 验证tick值是否符合tickSpacing要求
      const tickSpacing = pool.tickSpacing
      const tickLowerValid = Number.isInteger(positionDetail.tickLower) && positionDetail.tickLower % tickSpacing === 0
      const tickUpperValid = Number.isInteger(positionDetail.tickUpper) && positionDetail.tickUpper % tickSpacing === 0
      
      if (!tickLowerValid || !tickUpperValid) {
        console.warn('Skipping Position creation for invalid tick values in useExtraV3PositionInfo:', { 
          fee: positionDetail.fee,
          tickLower: positionDetail.tickLower,
          tickUpper: positionDetail.tickUpper,
          tickSpacing,
          tickLowerValid,
          tickUpperValid,
          tokenId: positionDetail.tokenId?.toString()
        })
        return undefined
      }
      
      try {
        return new Position({
          pool,
          liquidity: positionDetail.liquidity.toString(),
          tickLower: positionDetail.tickLower,
          tickUpper: positionDetail.tickUpper,
        })
      } catch (error) {
        console.error('Failed to create Position in useExtraV3PositionInfo:', { 
          fee: positionDetail.fee,
          tickLower: positionDetail.tickLower,
          tickUpper: positionDetail.tickUpper,
          tokenId: positionDetail.tokenId?.toString(),
          error: error instanceof Error ? error.message : String(error)
        })
        return undefined
      }
    }
    return undefined
  }, [pool, positionDetail])

  const tickAtLimit = useIsTickAtLimit(
    positionDetail?.fee as number,
    positionDetail?.tickLower as number,
    positionDetail?.tickUpper as number,
  )

  const outOfRange = useMemo(() => {
    return pool && positionDetail
      ? pool.tickCurrent < positionDetail.tickLower || pool.tickCurrent >= positionDetail.tickUpper
      : false
  }, [pool, positionDetail])

  const removed = useMemo(() => {
    return positionDetail ? positionDetail.liquidity === 0n : false
  }, [positionDetail])

  const price = useMemo(() => {
    return pool && token0 ? pool.priceOf(token0) : undefined
  }, [pool, token0])

  const { priceLower, priceUpper, quote, base } = useMemo(() => {
    // return {
    //   priceLower: position ? position.token0PriceLower : undefined,
    //   priceUpper: position ? position.token0PriceUpper : undefined,
    //   quote: token1,
    //   base: token0,
    // }
    return getPriceOrderingFromPositionForUI(position)
  }, [position])

  return {
    pool,
    position,
    tickAtLimit,
    outOfRange,
    removed,
    price,
    priceLower,
    priceUpper,
    currency0,
    currency1,
    quote,
    base,
  }
}

