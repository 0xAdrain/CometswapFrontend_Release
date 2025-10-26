import { bscTestnetTokens } from '@cometswap/tokens'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { DeserializedBveCometWrapperUserData, DeserializedFarmUserData, SerializedFarm } from '../types'

export const deserializeFarmUserData = (farm?: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm?.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    proxy: {
      allowance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.allowance) : BIG_ZERO,
      tokenBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.tokenBalance) : BIG_ZERO,
      stakedBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.stakedBalance) : BIG_ZERO,
      earnings: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.earnings) : BIG_ZERO,
    },
  }
}

export const deserializeFarmBveCometUserData = (farm?: SerializedFarm): DeserializedBveCometWrapperUserData => {
  return {
    allowance: farm?.bveCometUserData ? new BigNumber(farm.bveCometUserData.allowance) : BIG_ZERO,
    tokenBalance: farm?.bveCometUserData ? new BigNumber(farm.bveCometUserData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.bveCometUserData ? new BigNumber(farm.bveCometUserData.stakedBalance) : BIG_ZERO,
    earnings: farm?.bveCometUserData ? new BigNumber(farm.bveCometUserData.earnings) : BIG_ZERO,
    boosterMultiplier: farm?.bveCometUserData?.boosterMultiplier ?? 1,
    boostedAmounts: farm?.bveCometUserData?.boostedAmounts ? new BigNumber(farm.bveCometUserData.boostedAmounts) : BIG_ZERO,
    boosterContractAddress: farm?.bveCometUserData?.boosterContractAddress,
    rewardPerSecond: farm?.bveCometUserData?.rewardPerSecond
      ? getBalanceAmount(new BigNumber(farm?.bveCometUserData?.rewardPerSecond), bscTestnetTokens.comet.decimals).toNumber()
      : 0,
    startTimestamp: farm?.bveCometUserData?.startTimestamp,
    endTimestamp: farm?.bveCometUserData?.endTimestamp,
  }
}

export const deserializeFarmBveCometPublicData = (farm?: SerializedFarm): DeserializedBveCometWrapperUserData => {
  // const isRewardInRange = true
  const isRewardInRange =
    farm?.bveCometPublicData?.startTimestamp &&
    farm?.bveCometPublicData?.endTimestamp &&
    Date.now() / 1000 >= farm.bveCometPublicData.startTimestamp &&
    Date.now() / 1000 < farm.bveCometPublicData.endTimestamp
  return {
    allowance: farm?.bveCometPublicData ? new BigNumber(farm.bveCometPublicData.allowance) : BIG_ZERO,
    tokenBalance: farm?.bveCometPublicData ? new BigNumber(farm.bveCometPublicData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.bveCometPublicData ? new BigNumber(farm.bveCometPublicData.stakedBalance) : BIG_ZERO,
    earnings: farm?.bveCometPublicData ? new BigNumber(farm.bveCometPublicData.earnings) : BIG_ZERO,
    boosterMultiplier: isRewardInRange ? farm?.bveCometPublicData?.boosterMultiplier ?? 1 : 1,
    boostedAmounts: farm?.bveCometPublicData?.boostedAmounts
      ? new BigNumber(farm.bveCometPublicData.boostedAmounts)
      : BIG_ZERO,
    boosterContractAddress: farm?.bveCometPublicData?.boosterContractAddress,
    rewardPerSecond:
      farm?.bveCometPublicData?.rewardPerSecond && isRewardInRange
        ? getBalanceAmount(
            new BigNumber(farm?.bveCometPublicData?.rewardPerSecond),
            bscTestnetTokens.comet.decimals,
          ).toNumber()
        : 0,
    startTimestamp: farm?.bveCometPublicData?.startTimestamp,
    endTimestamp: farm?.bveCometPublicData?.endTimestamp,
    isRewardInRange: Boolean(isRewardInRange),
    totalLiquidityX: farm?.bveCometPublicData?.totalLiquidityX ?? 1,
  }
}
