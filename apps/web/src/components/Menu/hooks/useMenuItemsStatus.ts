import { useUserCometLockStatus } from 'hooks/useUserCometLockStatus'
import { useMemo } from 'react'
import { useVotingStatus } from './useVotingStatus'
import { useTradingRewardStatus } from './useTradingRewardStatus'
import { useIfoStatus } from './useIfoStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const ifoStatus = useIfoStatus()
  const votingStatus = useVotingStatus()
  const isUserLocked = useUserCometLockStatus()
  const tradingRewardStatus = useTradingRewardStatus()

  return useMemo(() => {
    return {
      '/ifo': ifoStatus || '',
      ...(votingStatus && {
        '/voting': votingStatus,
      }),
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
      ...(tradingRewardStatus && {
        '/trading-reward': tradingRewardStatus,
      }),
    }
  }, [ifoStatus, votingStatus, isUserLocked, tradingRewardStatus])
}

