import { ChainId } from '@cometswap/chains'
import { COMET, bscTestnetTokens } from '@cometswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMemo } from 'react'

// @notice: return only bsc or bsc-testnet comet token balance
export const useBSCCometBalance = () => {
  const { chainId } = useActiveChainId()
  const cakeAddress = useMemo(() => {
    if (ChainId.BSC === chainId) return COMET[chainId as ChainId].address
    if (ChainId.BSC_TESTNET === chainId) return bscTestnetTokens.comet2.address
    return undefined
  }, [chainId])
  const { balance } = useTokenBalance(cakeAddress)

  return balance
}

