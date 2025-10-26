import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { WEEK } from 'config/constants/Comet'
import { useRevenueSharingCometContract } from 'hooks/useContract'
import { useCurrentBlockTimestamp } from 'views/CometStaking/hooks/useCurrentBlockTimestamp'

export const useEpochRewards = (): number => {
  const revenueSharingPoolContract = useRevenueSharingCometContract()
  const currentTimestamp = useCurrentBlockTimestamp()

  const { data } = useQuery({
    queryKey: ['epochRewards', revenueSharingPoolContract.address],

    queryFn: async () => {
      const week = Math.floor(currentTimestamp / WEEK) * WEEK
      const amount = (await revenueSharingPoolContract.read.tokensPerWeek([BigInt(week)])) ?? 0n
      return Number(amount)
    },

    placeholderData: keepPreviousData,
  })

  return data ?? 0
}

