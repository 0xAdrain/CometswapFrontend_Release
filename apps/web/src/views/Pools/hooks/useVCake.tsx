import { ChainId } from '@cometswap/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVCometContract } from 'hooks/useContract'
import { useQuery } from '@tanstack/react-query'

interface UseVComet {
  isInitialization?: boolean
  refresh: () => void
}

const useVComet = (): UseVComet => {
  const { account, chainId } = useAccountActiveChain()
  const vCometContract = useVCometContract({ chainId })

  const { data, refetch } = useQuery({
    queryKey: ['/v-comet-initialization', account, chainId],

    queryFn: async () => {
      if (!account) return undefined
      try {
        return await vCometContract.read.initialization([account])
      } catch (error) {
        console.error('[ERROR] Fetching vComet initialization', error)
        return undefined
      }
    },

    enabled: Boolean(account && chainId === ChainId.BSC),
  })

  return {
    isInitialization: data,
    refresh: refetch,
  }
}

export default useVComet

