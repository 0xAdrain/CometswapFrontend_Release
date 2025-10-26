import { useQuery } from '@tanstack/react-query'
import { v2BCometWrapperABI } from 'config/abi/v2BCometWrapper'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'

export const getBCometWrapperInfo = async (chainId: number, bCometWrapperAddress: Address) => {
  const [rewardPerSecond] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address: bCometWrapperAddress,
        functionName: 'rewardPerSecond',
        abi: v2BCometWrapperABI,
      },
    ],
    allowFailure: false,
  })

  return { rewardPerSecond }
}

export const useBCometWrapperRewardPerSecond = (chainId?: number, bCometWrapperAddress?: Address) => {
  return useQuery({
    queryKey: ['bCometWrapperRewardPerSecond', chainId, bCometWrapperAddress],
    queryFn: () => getBCometWrapperInfo(chainId!, bCometWrapperAddress!),
    enabled: !!chainId && !!bCometWrapperAddress,
    select(data) {
      return data.rewardPerSecond
    },
  })
}

