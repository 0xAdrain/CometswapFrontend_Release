import { Pool, Position, TICK_SPACINGS } from '@cometswap/v3-sdk'
import { useCurrency } from 'hooks/Tokens'
import { PositionDetails } from '@cometswap/farms'
import { usePool } from './usePools'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  let position

  if (pool && positionDetails) {
    // 验证fee和tick值的有效性，避免TICK_LOWER/TICK_UPPER错误
    const validFeeAmounts = [100, 500, 2500, 10000]
    const isValidFeeAmount = positionDetails.isValidFee !== false && validFeeAmounts.includes(positionDetails.fee)
    
    if (!isValidFeeAmount) {
      console.warn('Skipping Position creation for invalid fee in useDerivedPositionInfo:', { 
        fee: positionDetails.fee,
        tokenId: positionDetails.tokenId?.toString() 
      })
      position = undefined
    } else {
      // 验证tick值是否符合tickSpacing要求
      const tickSpacing = TICK_SPACINGS[positionDetails.fee]
      const tickLowerValid = Number.isInteger(positionDetails.tickLower) && positionDetails.tickLower % tickSpacing === 0
      const tickUpperValid = Number.isInteger(positionDetails.tickUpper) && positionDetails.tickUpper % tickSpacing === 0
      
      if (!tickLowerValid || !tickUpperValid) {
        console.warn('Skipping Position creation for invalid tick values in useDerivedPositionInfo:', { 
          fee: positionDetails.fee,
          tickLower: positionDetails.tickLower,
          tickUpper: positionDetails.tickUpper,
          tickSpacing,
          tickLowerValid,
          tickUpperValid,
          tokenId: positionDetails.tokenId?.toString()
        })
        position = undefined
      } else {
        try {
          position = new Position({
            pool,
            liquidity: positionDetails.liquidity.toString(),
            tickLower: positionDetails.tickLower,
            tickUpper: positionDetails.tickUpper,
          })
        } catch (error) {
          console.error('Failed to create Position in useDerivedPositionInfo:', { 
            fee: positionDetails.fee,
            tickLower: positionDetails.tickLower,
            tickUpper: positionDetails.tickUpper,
            tokenId: positionDetails.tokenId?.toString(),
            error: error instanceof Error ? error.message : String(error)
          })
          position = undefined
        }
      }
    }
  }

  return {
    position,
    pool: pool ?? undefined,
  }
}

