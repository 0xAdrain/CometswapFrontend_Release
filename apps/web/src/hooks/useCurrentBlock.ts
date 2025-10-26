import { useBlockNumber } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export function useCurrentBlock() {
  const { chainId } = useActiveChainId()
  
  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: true,
    query: {
      refetchInterval: 12000, // 12 seconds
    },
  })

  return blockNumber
}


