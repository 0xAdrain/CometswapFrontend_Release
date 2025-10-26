import { getSourceChain } from '@cometswap/ifos'
import { useMemo } from 'react'
import { ChainId } from '@cometswap/chains'

// By deafult source chain is the first chain that supports native ifo
export function useIfoSourceChain(chainId?: ChainId) {
  return useMemo(() => getSourceChain(chainId) || ChainId.BSC, [chainId])
}

