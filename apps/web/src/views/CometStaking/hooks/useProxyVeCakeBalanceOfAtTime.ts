import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { useReadContract } from '@cometswap/wagmi'
import BigNumber from 'bignumber.js'
import { vecometABI } from 'config/abi/Comet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getCometAddress } from 'utils/addressHelpers'
import { isAddressEqual } from 'utils'
import { Address, zeroAddress } from 'viem'
import { CometPoolType } from '../types'
import { useVeCometUserInfo } from './useVeCometUserInfo'

export const useProxyCometBalanceOfAtTime = (timestamp: number) => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCometUserInfo()

  const hasProxy = useMemo(() => {
    const delegated = userInfo?.cakePoolType === CometPoolType.DELEGATED
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress) && !delegated
  }, [userInfo])

  const { status, refetch, data } = useReadContract({
    chainId,
    address: getCometAddress(chainId),
    functionName: 'balanceOfAtTime',
    abi: vecometABI,
    args: [userInfo?.cakePoolProxy as Address, BigInt(timestamp)],
    query: {
      enabled: Boolean(hasProxy && timestamp),
    },
    watch: true,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}

