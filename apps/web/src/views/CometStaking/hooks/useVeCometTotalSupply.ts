import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { vecometABI } from 'config/abi/veComet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useReadContract } from '@cometswap/wagmi'
import { getveCometAddress, getveCometAddressNoFallback } from 'utils/addressHelpers'
import { ChainId } from '@cometswap/chains'

export const useVeCometTotalSupply = () => {
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useReadContract({
    chainId: getveCometAddressNoFallback(chainId) ? chainId : ChainId.BSC,
    address: getveCometAddress(chainId),
    functionName: 'totalSupply',
    abi: vecometABI,
    query: {
      enabled: Boolean(getveCometAddress(chainId)),
    },
  })

  return {
    data: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}

