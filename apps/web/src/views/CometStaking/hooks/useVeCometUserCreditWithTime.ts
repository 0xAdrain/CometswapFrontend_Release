import { ChainId } from '@cometswap/chains'
import { ICOMET, iCometABI } from '@cometswap/ifos'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useReadContract } from '@cometswap/wagmi'
import { useMemo } from 'react'
import { Address } from 'viem'

interface useVeCometUserCreditWithTime {
  userCreditWithTime: number
  refresh: () => void
}

export const useVeCometUserCreditWithTime = (endTime: number): useVeCometUserCreditWithTime => {
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useReadContract({
    chainId,
    address: chainId && ICOMET[chainId] ? ICOMET[chainId] : ICOMET[ChainId.BSC],
    functionName: 'getUserCreditWithTime',
    abi: iCometABI,
    args: [account as Address, BigInt(endTime)],
    query: {
      enabled: Boolean(account && chainId && endTime),
    },
    watch: true,
  })

  const userCreditWithTime = useMemo(
    () => (typeof data !== 'undefined' ? new BigNumber(data.toString()).toNumber() : 0),
    [data],
  )

  return {
    userCreditWithTime,
    refresh: refetch,
  }
}

