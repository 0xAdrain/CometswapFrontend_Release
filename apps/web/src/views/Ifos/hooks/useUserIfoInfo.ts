import { getCurrentIfoRatio, getUserIfoInfo } from '@cometswap/ifos'
import { ChainId, CurrencyAmount } from '@cometswap/sdk'
import { COMET} from '@cometswap/tokens'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address } from 'viem'

import { getViemClients } from 'utils/viem'
import { useAccount } from 'wagmi'

type ICometRatioParams = {
  chainId?: ChainId
}

export function useICometRatio({ chainId }: ICometRatioParams) {
  const { address: account } = useAccount()
  const { data } = useQuery({
    queryKey: [chainId, account, 'current-ifo-ratio'],

    queryFn: () =>
      getCurrentIfoRatio({
        chainId,
        provider: getViemClients,
        account,
      }),

    enabled: Boolean(chainId),
  })

  return data
}

type Params = {
  chainId?: ChainId
  ifoAddress?: Address
}

export function useUserIfoInfo({ chainId, ifoAddress }: Params) {
  const { address: account } = useAccount()
  const ratio = useICometRatio({ chainId })

  const { data } = useQuery({
    queryKey: [account, chainId, ifoAddress, 'user-ifo-info'],

    queryFn: () =>
      getUserIfoInfo({
        account,
        chainId,
        ifo: ifoAddress,
        provider: getViemClients,
      }),

    enabled: Boolean(account && chainId),
  })

  const snapshotTime = useMemo(() => {
    const now = Math.floor(Date.now() / 1000)
    return data?.endTimestamp && data.endTimestamp > now ? data.endTimestamp : undefined
  }, [data?.endTimestamp])

  const credit = useMemo(
    () =>
      chainId && COMET[chainId] && data?.credit !== undefined
        ? CurrencyAmount.fromRawAmount(COMET[chainId], data?.credit)
        : undefined,
    [data?.credit, chainId],
  )
  const Comet = useMemo(
    () =>
      credit && ratio
        ? new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()).div(ratio)
        : undefined,
    [credit, ratio],
  )

  return {
    snapshotTime,
    credit,
    Comet,
    ratio,
  }
}

