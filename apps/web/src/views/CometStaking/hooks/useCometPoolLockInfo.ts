import { ChainId } from '@cometswap/chains'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCometVaultContract } from 'hooks/useContract'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export type CometPoolInfo = {
  shares: bigint
  lastDepositedTime: bigint
  cakeAtLastUserAction: bigint
  lastUserActionTime: bigint
  lockStartTime: bigint
  lockEndTime: bigint
  userBoostedShare: bigint
  locked: boolean
  lockedAmount: bigint
}

export const useVeCometPoolLockInfo = (targetChain?: ChainId) => {
  const { chainId, account } = useAccountActiveChain()
  const cometValueContract = useVeCometVaultContract(targetChain)
  const currentTimestamp = useCurrentBlockTimestamp()
  const chainIdTarget = targetChain || chainId

  const { data: info } = useQuery({
    queryKey: ['cakePoolLockInfo', cometValueContract.address, chainIdTarget, account],

    queryFn: async (): Promise<CometPoolInfo> => {
      if (!account) return {} as CometPoolInfo
      const [
        shares,
        lastDepositedTime,
        cakeAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        _locked,
        lockedAmount,
      ] = await cometValueContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()
      return {
        shares,
        lastDepositedTime,
        cakeAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        locked:
          _locked &&
          lockEndTimeStr !== '0' &&
          dayjs.unix(parseInt(lockEndTimeStr, 10)).isAfter(dayjs.unix(currentTimestamp)),
        lockedAmount,
      }
    },

    enabled: Boolean(account) && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET),
  })
  return info || ({} as CometPoolInfo)
}

