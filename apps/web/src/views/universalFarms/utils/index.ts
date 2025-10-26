import { CHAINS } from 'config/chains'
import type { ChainId } from '@cometswap/chains'

export function getChainFullName(chainId: ChainId) {
  return CHAINS.find((chain) => chain.id === chainId)?.name
}

