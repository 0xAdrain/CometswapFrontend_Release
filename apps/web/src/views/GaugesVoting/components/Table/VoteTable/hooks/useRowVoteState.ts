import { Percent } from '@cometswap/sdk'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useEffect, useMemo } from 'react'
import { Hex } from 'viem'
import { useCurrentBlockTimestamp } from 'views/CometStaking/hooks/useCurrentBlockTimestamp'
import { useProxyCometBalance } from 'views/CometStaking/hooks/useProxyCometBalance'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { DEFAULT_VOTE, RowProps } from '../types'

export const useRowVoteState = ({ data, vote, onChange }: RowProps) => {
  const userVote = useUserVote(data)
  const voteLocked = userVote?.voteLocked
  const { balance: vecometBalance } = useVeCometBalance()
  const { balance: proxyCometBalance } = useProxyCometBalance()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: epochVotePower, isLoading: isLoadingEpochVotePower } = useEpochVotePower()
  const willUnlock = useMemo(
    () => epochVotePower === 0n && Boolean(userVote?.slope && userVote?.slope > 0),
    [epochVotePower, userVote?.slope],
  )
  // const nextEpochStart = useNextEpochStart()
  const currentVoteWeightAmount = useMemo(() => {
    const { nativeSlope = 0n, nativeEnd = 0n, proxySlope = 0n, proxyEnd = 0n } = userVote || {}
    let nativeWeight = 0n
    let proxyWeight = 0n
    if (nativeSlope > 0n) {
      nativeWeight = nativeSlope * (nativeEnd - BigInt(currentTimestamp))
      nativeWeight = nativeWeight > 0n ? nativeWeight : 0n
    }
    if (proxySlope > 0n) {
      proxyWeight = proxySlope * (proxyEnd - BigInt(currentTimestamp))
      proxyWeight = proxyWeight > 0n ? proxyWeight : 0n
    }

    const amountInt = nativeWeight + proxyWeight
    return amountInt
  }, [currentTimestamp, userVote])

  const currentVoteWeight = useMemo(() => {
    const amount = getBalanceNumber(new BN(currentVoteWeightAmount.toString()))
    if (amount === 0) return 0
    if (amount < 1) return amount.toPrecision(2)
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [currentVoteWeightAmount])

  const currentVotePercent = useMemo(() => {
    return userVote?.power && Number(currentVoteWeightAmount) > 0
      ? String(Number(new Percent(userVote?.power, 10000).toFixed(2)))
      : undefined
  }, [currentVoteWeightAmount, userVote?.power])

  const voteValue = useMemo(() => {
    if (voteLocked) return currentVotePercent ?? ''
    if (willUnlock) return '0'
    if (vote?.power === DEFAULT_VOTE.power) return currentVotePercent ?? ''
    return vote?.power ?? ''
  }, [voteLocked, currentVotePercent, willUnlock, vote?.power])

  const previewVoteWeightAmount = useMemo(() => {
    const p = Number(voteValue || 0) * 100
    // const powerBN = new BN(epochVotePower.toString())
    let balance = vecometBalance
    if (userVote?.ignoredSide === 'proxy') {
      balance = vecometBalance.minus(proxyCometBalance)
    }
    if (userVote?.ignoredSide === 'native') {
      balance = proxyCometBalance
    }
    const amount = getBalanceNumber(balance.times(p).div(10000))
    return amount
  }, [proxyCometBalance, userVote?.ignoredSide, vecometBalance, voteValue])
  const previewVoteWeight = useMemo(() => {
    if (previewVoteWeightAmount === 0) return 0
    if (previewVoteWeightAmount < 1) return previewVoteWeightAmount.toPrecision(2)
    return previewVoteWeightAmount < 1000
      ? previewVoteWeightAmount.toFixed(2)
      : formatLocalisedCompactNumber(previewVoteWeightAmount, true)
  }, [previewVoteWeightAmount])

  // when previous vote is changed, highlight the changed number
  const changeHighlight = useMemo(() => {
    const prev = getBalanceNumber(new BN(currentVoteWeightAmount.toString())).toPrecision(2)
    const current = previewVoteWeightAmount.toPrecision(2)
    return prev !== current
  }, [currentVoteWeightAmount, previewVoteWeightAmount])

  // init vote value if still default
  useEffect(() => {
    if (!isLoadingEpochVotePower && userVote?.hash && (!vote?.hash || vote?.hash === '0x')) {
      onChange({
        hash: userVote.hash as Hex,
        power: voteValue,
        locked: voteLocked,
      })
    }
  }, [isLoadingEpochVotePower, onChange, userVote?.hash, vote, voteLocked, voteValue])

  return {
    currentVoteWeight,
    currentVotePercent,
    previewVoteWeight,
    voteValue,
    voteLocked,
    willUnlock,
    proxyCometBalance,
    changeHighlight,
  }
}

