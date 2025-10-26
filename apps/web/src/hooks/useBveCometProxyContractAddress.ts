import { ChainId } from '@cometswap/sdk'
import { useActiveChainId } from './useActiveChainId'

// Mock addresses - replace with actual contract addresses
const BVECOMET_PROXY_ADDRESSES: { [chainId: number]: string } = {
  [ChainId.BSC]: '0x0000000000000000000000000000000000000000', // Replace with actual address
  [ChainId.ETHEREUM]: '0x0000000000000000000000000000000000000000', // Replace with actual address
}

export function useBveCometProxyContractAddress(): string | undefined {
  const { chainId } = useActiveChainId()
  
  if (!chainId) return undefined
  
  return BVECOMET_PROXY_ADDRESSES[chainId]
}

// Alias for backward compatibility
export const useBCometProxyContractAddress = useBveCometProxyContractAddress




