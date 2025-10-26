import { COMET, STABLE_COIN, USDC, USDT } from '@cometswap/tokens'
import { FeeAmount } from '@cometswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'

export function useCurrencyParams(): {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
  feeAmount: FeeAmount | undefined
} {
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB, feeAmountFromUrl] =
    router.isReady && chainId
      ? router.query.currency || [
          native.symbol,
          COMET[chainId]?.address || STABLE_COIN[chainId]?.address || USDC[chainId]?.address || USDT[chainId]?.address,
        ]
      : [undefined, undefined, undefined]

  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined

  return { currencyIdA, currencyIdB, feeAmount }
}

