import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getApy } from '@cometswap/utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from '@cometswap/utils/formatBalance'
import memoize from 'lodash/memoize'
import { Token } from '@cometswap/sdk'
import { Pool } from '@cometswap/widgets-internal'

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000)

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000)

export const convertSharesToComet = (
  shares: BigNumber,
  cometPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber,
) => {
  const sharePriceNumber = getBalanceNumber(cometPerFullShare, decimals)
  const amountInComet = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
  const cometAsNumberBalance = getBalanceNumber(amountInComet, decimals)
  const cometAsBigNumber = getDecimalAmount(new BigNumber(cometAsNumberBalance), decimals)
  const cometAsDisplayBalance = getFullDisplayBalance(amountInComet, decimals, decimalsToRound)
  return { cometAsNumberBalance, cometAsBigNumber, cometAsDisplayBalance }
}

export const convertCometToShares = (
  comet: BigNumber,
  cometPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(cometPerFullShare, decimals)
  const amountInShares = new BigNumber(comet.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: Pool.DeserializedPool<Token>, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = vaultKey
    ? vaultPoolConfig[vaultKey].autoCompoundFrequency
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey && apr !== undefined) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getCometVaultEarnings = (
  account: string | undefined,
  cometAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber,
) => {
  const hasAutoEarnings = account && cometAtLastUserAction?.gt(0) && userShares?.gt(0)
  const { cometAsBigNumber } = convertSharesToComet(userShares, pricePerFullShare)
  const autoCometProfit = cometAsBigNumber.minus(fee || BIG_ZERO).minus(cometAtLastUserAction)
  const autoCometToDisplay = autoCometProfit.gte(0) ? getBalanceNumber(autoCometProfit, 18) : 0

  const autoUsdProfit = autoCometProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoCometToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = memoize(
  (pool: Pool.DeserializedPool<Token>, currentBlock: number) => {
    const { startTimestamp, endTimestamp, isFinished } = pool
    const shouldShowBlockCountdown = Boolean(!isFinished && startTimestamp && endTimestamp)
    const now = Math.floor(Date.now() / 1000)
    const timeUntilStart = Math.max((startTimestamp || 0) - now, 0)
    const timeRemaining = Math.max((endTimestamp || 0) - now, 0)
    const hasPoolStarted = timeUntilStart <= 0 && timeRemaining > 0
    const timeToDisplay = hasPoolStarted ? timeRemaining : timeUntilStart
    return { shouldShowBlockCountdown, timeUntilStart, timeRemaining, hasPoolStarted, timeToDisplay, currentBlock }
  },
  (pool, currentBlock) => `${pool.startTimestamp}#${pool.endTimestamp}#${pool.isFinished}#${currentBlock}`,
)

export const getICometWeekDisplay = (ceiling: BigNumber) => {
  const weeks = new BigNumber(ceiling).div(60).div(60).div(24).div(7)
  return Math.round(weeks.toNumber())
}

