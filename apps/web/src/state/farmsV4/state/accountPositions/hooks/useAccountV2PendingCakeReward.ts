import { BveCometWrapperFarmConfig } from '@cometswap/farms'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useCallback } from 'react'
import { getAccountV2FarmingBveCometWrapperEarning } from '../fetcher'

export const useAccountV2PendingveCometReward = (
  account: Address | undefined,
  bveCometWrapperConfig: Partial<BveCometWrapperFarmConfig>,
) => {
  return useQuery({
    queryKey: [
      'accountV2PendingveCometReward',
      account,
      bveCometWrapperConfig.chainId,
      bveCometWrapperConfig.bveCometWrapperAddress,
    ],
    queryFn: () =>
      getAccountV2FarmingBveCometWrapperEarning(bveCometWrapperConfig.chainId!, account!, [
        bveCometWrapperConfig as BveCometWrapperFarmConfig,
      ]),
    enabled: Boolean(account && bveCometWrapperConfig.chainId && bveCometWrapperConfig.bveCometWrapperAddress),
    select: useCallback((data: string[]) => data?.[0], []),
  })
}

