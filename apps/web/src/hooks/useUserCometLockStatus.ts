import { useAccount } from 'wagmi'
import { ChainId } from '@cometswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useCometVaultV2Contract } from 'hooks/useContract'
import { useActiveChainId } from './useActiveChainId'

export const useUserCometLockStatus = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const cometValueContract = useCometVaultV2Contract()

  const { data: userveCometLockStatus = null } = useQuery({
    queryKey: ['userveCometLockStatus', account],

    queryFn: async () => {
      if (!account) return undefined
      const [, , , , , lockEndTime, , locked] = await cometValueContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()
      return locked && (lockEndTimeStr === '0' || Date.now() > parseInt(lockEndTimeStr) * 1000)
    },

    enabled: Boolean(account && chainId === ChainId.BSC),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  return userveCometLockStatus
}

