import type { ChainId } from '@cometswap/chains'
import type { SerializedToken, Token } from '@cometswap/sdk'

import { allTokens } from '../allTokens'

export function getTokensByChain(chainId?: ChainId): Token[] {
  if (!chainId) {
    return []
  }

  const tokenMap = allTokens[chainId]
  return Object.values(tokenMap)
}

export function getTokenByAddress(chainId: ChainId, address: SerializedToken['address']) {
  const tokens = getTokensByChain(chainId)
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase())
}
