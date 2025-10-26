import { Currency, CurrencyAmount, TradeType } from '@cometswap/sdk'
import { SmartRouter } from '@cometswap/smart-router/evm'
import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'
import { useCurrentBlock } from './useCurrentBlock'

interface UseBestAMMTradeOptions {
  amount?: CurrencyAmount<Currency>
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
  enabled?: boolean
}

export function useBestAMMTrade({
  amount,
  currency,
  tradeType = TradeType.EXACT_INPUT,
  maxHops = 3,
  maxSplits = 4,
  enabled = true,
}: UseBestAMMTradeOptions) {
  const { chainId } = useActiveChainId()
  const currentBlock = useCurrentBlock()
  
  const deferredAmount = useDeferredValue(amount)
  const deferredCurrency = useDeferredValue(currency)

  const queryKey = useMemo(
    () => [
      'bestAMMTrade',
      chainId,
      deferredAmount?.quotient?.toString(),
      deferredAmount?.currency?.symbol,
      deferredCurrency?.symbol,
      tradeType,
      maxHops,
      maxSplits,
      currentBlock,
    ],
    [chainId, deferredAmount, deferredCurrency, tradeType, maxHops, maxSplits, currentBlock]
  )

  const {
    data: trade,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!deferredAmount || !deferredCurrency || !chainId) {
        return null
      }

      try {
        const bestTrade = await SmartRouter.getBestTrade(
          deferredAmount,
          deferredCurrency,
          tradeType,
          {
            maxHops,
            maxSplits,
            gasPriceWei: () => Promise.resolve(undefined),
          }
        )

        return bestTrade
      } catch (err) {
        console.error('Error fetching best AMM trade:', err)
        throw err
      }
    },
    enabled: Boolean(enabled && deferredAmount && deferredCurrency && chainId),
    staleTime: 10000, // 10 seconds
    gcTime: 30000, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
  })

  return {
    trade,
    error,
    isLoading,
    isError,
  }
}

export default useBestAMMTrade