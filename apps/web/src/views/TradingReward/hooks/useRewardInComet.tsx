import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'

interface UseRewardInCometProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  totalReward: string
  cometPriceBusd: BigNumber
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInComet = ({
  timeRemaining,
  totalEstimateRewardUSD,
  totalReward,
  cometPriceBusd,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInCometProps) => {
  const estimateRewardUSD = new BigNumber(totalEstimateRewardUSD)
  const reward = getBalanceAmount(new BigNumber(totalReward))
  const rewardCometPrice = getBalanceAmount(new BigNumber(rewardPrice ?? '0'), rewardTokenDecimal ?? 0)
  const totalCometReward = reward.div(rewardCometPrice).isNaN() ? 0 : reward.div(rewardCometPrice).toNumber()

  return timeRemaining > 0 ? estimateRewardUSD.div(cometPriceBusd).toNumber() : totalCometReward
}

export default useRewardInComet
