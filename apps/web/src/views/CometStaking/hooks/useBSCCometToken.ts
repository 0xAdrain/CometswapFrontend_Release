import { ChainId, Token } from '@cometswap/sdk'
import { COMET, bscTestnetTokens } from '@cometswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useBSCCometToken = (): Token | undefined => {
  const { chainId } = useActiveChainId()

  if (chainId === ChainId.BSC) return COMET[chainId]
  if (chainId === ChainId.BSC_TESTNET) return bscTestnetTokens.comet2

  return undefined
}

