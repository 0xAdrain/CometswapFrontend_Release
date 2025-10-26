import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const fetchAffiliateList = async (account: Address): Promise<any> => {
  // CometSwap: 禁用联盟计划功能，直接返回false
  return false
}

export const useUserIsInAffiliateListData = () => {
  const { address: account } = useAccount()
  const { data } = useQuery({
    queryKey: ['IsInAffiliateListData', account],
    queryFn: async () => {
      // CometSwap: 联盟计划功能已禁用，直接返回false
      return false
    },
    enabled: Boolean(account),
  })

  return useMemo(() => data ?? false, [data])
}

