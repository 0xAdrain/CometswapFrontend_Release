import { Token, WNATIVE } from '@cometswap/sdk'
import { ChainId } from '@cometswap/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
