import { ChainId } from '@cometswap/chains'
import { Box } from '@cometswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import Banner from 'views/TradingReward/components/Banner'
import CurrentRewardPool from 'views/TradingReward/components/CurrentRewardPool'
import HowToEarn from 'views/TradingReward/components/HowToEarn'
import Questions from 'views/TradingReward/components/Questions'
import RewardsBreakdown from 'views/TradingReward/components/RewardsBreakdown'
import SubMenu from 'views/TradingReward/components/SubMenu'
import YourTradingReward from 'views/TradingReward/components/YourTradingReward'
import useAllTradingRewardPair, { RewardStatus, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useAllUserCampaignInfo from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useCampaignIdInfo from 'views/TradingReward/hooks/useCampaignIdInfo'
import { useFarmsV3Public } from 'state/farmsV3/hooks'

const TradingReward = () => {
  const { chainId } = useActiveChainId()

  const { data: allTradingRewardPairData, isFetching: isAllTradingRewardPairDataFetching } = useAllTradingRewardPair({
    status: RewardStatus.ALL,
    type: RewardType.COMET_STAKERS,
  })
  const { data: farmsV3 } = useFarmsV3Public()

  const campaignId = allTradingRewardPairData.campaignIds[allTradingRewardPairData.campaignIds.length - 1]
  const { data: campaignInfoData, isFetching: isCampaignInfoFetching } = useCampaignIdInfo({
    campaignId,
    type: RewardType.COMET_STAKERS,
  })
  const { data: allUserCampaignInfo, isFetching: isAllUserCampaignInfo } = useAllUserCampaignInfo({
    campaignIds: allTradingRewardPairData.campaignIds,
    type: RewardType.COMET_STAKERS,
  })

  const isFetching = useMemo(
    () => isAllTradingRewardPairDataFetching || isAllUserCampaignInfo || isCampaignInfoFetching,
    [isAllTradingRewardPairDataFetching, isAllUserCampaignInfo, isCampaignInfoFetching],
  )

  const currentUserIncentive = useMemo(
    () =>
      allTradingRewardPairData.campaignIdsIncentive.find(
        (campaign) => campaign?.campaignId?.toLowerCase() === campaignId.toLowerCase(),
      ),
    [campaignId, allTradingRewardPairData],
  )

  const currentUserCampaignInfo = useMemo(
    () => allUserCampaignInfo.find((campaign) => campaign.campaignId.toLowerCase() === campaignId.toLowerCase()),
    [campaignId, allUserCampaignInfo],
  )

  const totalAvailableClaimData = useMemo(() => {
    const currentTime = Date.now() / 1000

    return allUserCampaignInfo
      .map((item) => {
        const tradingRewardPair = allTradingRewardPairData.campaignIdsIncentive.find(
          (pair) => pair.campaignId === item.campaignId,
        )

        return {
          ...item,
          campaignClaimTime: tradingRewardPair?.campaignClaimTime,
          campaignClaimEndTime: tradingRewardPair?.campaignClaimEndTime,
        }
      })
      .filter((item) => currentTime > Number(item?.campaignClaimTime ?? 0))
  }, [allTradingRewardPairData, allUserCampaignInfo])

  if (chainId !== ChainId.BSC) {
    return null
  }

  return (
    <Box>
      <SubMenu />
      <Banner />
      <YourTradingReward
        isFetching={isFetching}
        incentives={currentUserIncentive}
        qualification={allTradingRewardPairData.qualification}
        campaignIds={allTradingRewardPairData.campaignIds}
        campaignIdsIncentive={allTradingRewardPairData.campaignIdsIncentive}
        rewardInfo={allTradingRewardPairData.rewardInfo}
        currentUserCampaignInfo={currentUserCampaignInfo}
        totalAvailableClaimData={totalAvailableClaimData}
      />
      <CurrentRewardPool
        campaignId={campaignId}
        incentives={currentUserIncentive}
        campaignInfoData={campaignInfoData}
        rewardInfo={allTradingRewardPairData.rewardInfo}
      />
      <HowToEarn />
      <RewardsBreakdown
        type={RewardType.COMET_STAKERS}
        allUserCampaignInfo={allUserCampaignInfo}
        allTradingRewardPairData={allTradingRewardPairData}
        campaignPairs={allTradingRewardPairData.campaignPairs}
        farms={farmsV3.farmsWithPrice}
      />
      <Questions />
    </Box>
  )
}

export default TradingReward
