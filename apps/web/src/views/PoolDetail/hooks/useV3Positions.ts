import { unwrappedToken } from '@cometswap/tokens'
import { Position, TICK_SPACINGS } from '@cometswap/v3-sdk'
import { useTokenByChainId } from 'hooks/Tokens'
import { usePoolByChainId } from 'hooks/v3/usePools'
import { useMemo } from 'react'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { Address } from 'viem'

export const useV3Positions = (
  chainId?: number,
  token0_?: Address,
  token1_?: Address,
  fee?: number,
  positionDetails?: PositionDetail[],
): Position[] => {
  const token0 = useTokenByChainId(token0_, chainId)
  const token1 = useTokenByChainId(token1_, chainId)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [, pool] = usePoolByChainId(currency0 ?? undefined, currency1 ?? undefined, fee)

  return useMemo(() => {
    if (pool && positionDetails && positionDetails.length > 0) {
      return positionDetails
        .map((positionDetail) => {
          // 验证fee和tick值的有效性，避免TICK_LOWER/TICK_UPPER错误
          const validFeeAmounts = [100, 500, 2500, 10000]
          const isValidFeeAmount = fee && validFeeAmounts.includes(fee)
          
          if (!isValidFeeAmount) {
            console.warn('Skipping Position creation for invalid fee in useV3Positions:', { 
              fee,
              tokenId: positionDetail.tokenId?.toString() 
            })
            return null
          }
          
          // 验证tick值是否符合tickSpacing要求
          const tickSpacing = pool.tickSpacing
          const tickLowerValid = Number.isInteger(positionDetail.tickLower) && positionDetail.tickLower % tickSpacing === 0
          const tickUpperValid = Number.isInteger(positionDetail.tickUpper) && positionDetail.tickUpper % tickSpacing === 0
          
          if (!tickLowerValid || !tickUpperValid) {
            console.warn('Skipping Position creation for invalid tick values in useV3Positions:', { 
              fee,
              tickLower: positionDetail.tickLower,
              tickUpper: positionDetail.tickUpper,
              tickSpacing,
              tickLowerValid,
              tickUpperValid,
              tokenId: positionDetail.tokenId?.toString()
            })
            return null
          }
          
          try {
            return new Position({
              pool,
              liquidity: positionDetail.liquidity.toString(),
              tickLower: positionDetail.tickLower,
              tickUpper: positionDetail.tickUpper,
            })
          } catch (error) {
            console.error('Failed to create Position in useV3Positions:', { 
              fee,
              tickLower: positionDetail.tickLower,
              tickUpper: positionDetail.tickUpper,
              tokenId: positionDetail.tokenId?.toString(),
              error: error instanceof Error ? error.message : String(error)
            })
            return null
          }
        })
        .filter((position): position is Position => position !== null)
    }
    return []
  }, [pool, positionDetails, fee])
}

