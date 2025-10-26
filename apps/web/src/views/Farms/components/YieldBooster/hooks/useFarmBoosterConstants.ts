import { getBCometFarmBoosterAddress } from 'utils/addressHelpers'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@cometswap/chains'
import { bCometFarmBoosterABI } from 'config/abi/bCometFarmBooster'
import { useQuery } from '@tanstack/react-query'

const useFarmBoosterConstants = () => {
  const bCometFarmBoosterAddress = getBCometFarmBoosterAddress()

  const { data, status } = useQuery({
    queryKey: ['farmBoosterConstants'],

    queryFn: async () => {
      return publicClient({ chainId: ChainId.BSC }).multicall({
        contracts: [
          {
            address: bCometFarmBoosterAddress,
            abi: bCometFarmBoosterABI,
            functionName: 'cA',
          },
          {
            address: bCometFarmBoosterAddress,
            abi: bCometFarmBoosterABI,
            functionName: 'CA_PRECISION',
          },
          {
            address: bCometFarmBoosterAddress,
            abi: bCometFarmBoosterABI,
            functionName: 'cB',
          },
        ],
        allowFailure: false,
      })
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  return useMemo(() => {
    return {
      constants: data && {
        cA: new BigNumber(data[0].toString()).div(new BigNumber(data[1].toString())).toNumber(),
        cB: new BigNumber(data[2].toString()).toNumber(),
      },
      isLoading: status !== 'success',
    }
  }, [data, status])
}

export default useFarmBoosterConstants

