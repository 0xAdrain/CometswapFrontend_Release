import { Currency, CurrencyAmount, Token } from '@cometswap/sdk'
import { FeeAmount, Position, TICK_SPACINGS } from '@cometswap/v3-sdk'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { useMemo } from 'react'
import { PositionDetails } from '@cometswap/farms'
import { usePool } from './usePools'

interface LiquidityTotalHookProps {
  token0: Token
  token1: Token
  feeAmount: FeeAmount
  positionsDetailsList: PositionDetails[]
}

export function useV3LiquidityTotal({
  token0,
  token1,
  feeAmount,
  positionsDetailsList,
}: LiquidityTotalHookProps): CurrencyAmount<Currency> | null {
  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const positions = useMemo(() => {
    return positionsDetailsList.map(({ liquidity, tickLower, tickUpper, isValidFee }) => {
      if (pool && typeof liquidity === 'bigint' && typeof tickLower === 'number' && typeof tickUpper === 'number') {
        // 验证fee和tick值的有效性，避免TICK_LOWER/TICK_UPPER错误
        const validFeeAmounts = [100, 500, 2500, 10000]
        const isValidFeeAmount = isValidFee !== false && validFeeAmounts.includes(feeAmount)
        
        if (!isValidFeeAmount) {
          console.warn('Skipping Position creation for invalid fee in usePositionV3Liquidity:', { feeAmount })
          return undefined
        }
        
        // 验证tick值是否符合tickSpacing要求
        const tickSpacing = TICK_SPACINGS[feeAmount]
        const tickLowerValid = Number.isInteger(tickLower) && tickLower % tickSpacing === 0
        const tickUpperValid = Number.isInteger(tickUpper) && tickUpper % tickSpacing === 0
        
        if (!tickLowerValid || !tickUpperValid) {
          console.warn('Skipping Position creation for invalid tick values in usePositionV3Liquidity:', { 
            feeAmount, 
            tickLower, 
            tickUpper, 
            tickSpacing,
            tickLowerValid,
            tickUpperValid 
          })
          return undefined
        }
        
        try {
          return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
        } catch (error) {
          console.error('Failed to create Position in usePositionV3Liquidity:', { 
            feeAmount, 
            tickLower, 
            tickUpper, 
            error: error instanceof Error ? error.message : String(error)
          })
          return undefined
        }
      }

      return undefined
    })
  }, [positionsDetailsList, pool, feeAmount])

  const price0 = useStablecoinPrice(token0 ?? undefined)
  const price1 = useStablecoinPrice(token1 ?? undefined)

  return useMemo(() => {
    if (!price0 || !price1) return null

    const liqArr = positions
      .filter((position): position is Position => {
        return Boolean(position)
      })
      .map((position) => {
        const amount0 = price0.quote(position.amount0)
        const amount1 = price1.quote(position.amount1)
        return amount0.add(amount1)
      })

    return liqArr.reduce((sum, liquidity) => (sum ? sum.add(liquidity) : sum))
  }, [positions, price0, price1])
}

