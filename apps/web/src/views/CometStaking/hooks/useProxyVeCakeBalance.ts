import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { useReadContract } from '@cometswap/wagmi'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getCometAddress } from 'utils/addressHelpers'
import { isAddressEqual } from 'utils'
import { Address, erc20Abi, zeroAddress } from 'viem'
import { CometPoolType } from '../types'
import { useVeCometUserInfo } from './useVeCometUserInfo'

export const useProxyCometBalance = () => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeCometUserInfo()

  const hasProxy = useMemo(() => {
    const delegated = userInfo?.cakePoolType === CometPoolType.DELEGATED
    return userInfo && userInfo?.cakePoolProxy && !isAddressEqual(userInfo!.cakePoolProxy, zeroAddress) && !delegated
  }, [userInfo])

  const { status, refetch, data } = useReadContract({
    chainId,
    address: getCometAddress(chainId),
    functionName: 'balanceOf',
    abi: erc20Abi,
    args: [userInfo?.cakePoolProxy as Address],
    query: {
      enabled: hasProxy,
    },
    watch: true,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}

