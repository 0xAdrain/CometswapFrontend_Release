import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'

interface UseRewardInUSDProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  canClaim: string
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInUSD = ({
  timeRemaining,
  totalEstimateRewardUSD,
  canClaim,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInUSDProps) => {
  const rewardCometUSDPriceAsBg = getBalanceAmount(new BigNumber(rewardPrice), rewardTokenDecimal)
  const rewardCometAmount = getBalanceAmount(new BigNumber(canClaim), rewardTokenDecimal)

  return timeRemaining > 0
    ? totalEstimateRewardUSD || 0
    : rewardCometAmount.times(rewardCometUSDPriceAsBg).toNumber() || 0
}

export default useRewardInUSD
