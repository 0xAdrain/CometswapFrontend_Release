import { useTranslation } from '@cometswap/localization'
import { Flex, Message, MessageText, Text, useModal } from '@cometswap/uikit'
import { formatNumber } from '@cometswap/utils/formatBalance'
import getTimePeriods from '@cometswap/utils/getTimePeriods'
import { GreyCard } from 'components/Card'
import { useCometPrice } from 'hooks/useCometPrice'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { CometLockStatus } from 'views/CometStaking/types'
import { Header } from 'views/TradingReward/components/YourTradingReward/VeComet/Header'
import { NoLockingCometModal } from 'views/TradingReward/components/YourTradingReward/VeComet/NoLockingCometModal'
import {
  VeCometAddCometOrWeeksModal,
  VeCometModalView,
} from 'views/TradingReward/components/YourTradingReward/VeComet/VeCometAddCometOrWeeksModal'
import { VeCometButtonWithMessage } from 'views/TradingReward/components/YourTradingReward/VeComet/VeCometButtonWithMessage'
import { VeCometPreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeComet/VeCometPreviewTextInfo'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useRewardInComet from 'views/TradingReward/hooks/useRewardInComet'
import useRewardInUSD from 'views/TradingReward/hooks/useRewardInUSD'

interface VeCometPreviewProps {
  thresholdLockAmount: number
  endTime: number
  timeRemaining: number
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail | undefined
}

export const VeCometPreview: React.FC<React.PropsWithChildren<VeCometPreviewProps>> = ({
  timeRemaining,
  thresholdLockAmount,
  endTime,
  rewardInfo,
  currentUserCampaignInfo,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const cometPriceBusd = useCometPrice()
  const { status, cometLockExpired, cometLocked } = useCometLockStatus()
  const timeUntil = getTimePeriods(timeRemaining)

  const [onPresentNoLockingCometModal] = useModal(
    <NoLockingCometModal endTime={endTime} thresholdLockAmount={thresholdLockAmount} />,
  )

  const [onPresentVeCometAddCometModal] = useModal(
    <VeCometAddCometOrWeeksModal
      showSwitchButton
      viewMode={VeCometModalView.COMET_FORM_VIEW}
      endTime={endTime}
      thresholdLockAmount={thresholdLockAmount}
    />,
  )

  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId ?? 0],
    [rewardInfo, currentUserCampaignInfo],
  )

  const rewardInUSD = useRewardInUSD({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    canClaim: currentUserCampaignInfo?.canClaim ?? '0',
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const rewardInComet = useRewardInComet({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    totalReward: currentUserCampaignInfo?.canClaim ?? '0',
    cometPriceBusd,
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const handleUnlockButton = () => {
    router.push(`/comet-staking`)
  }

  return (
    <Flex flexDirection={['column']}>
      <Header />

      {rewardInUSD > 0.01 && (
        <GreyCard mb="24px">
          <Text textTransform="uppercase" color="secondary" bold mb="4px">
            {t('You have earn some trading REWARDS')}
          </Text>
          <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
          <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInComet)} COMET`}</Text>

          <Message variant="danger" mt="10px">
            <MessageText>
              <Text as="span" bold m="0 4px">{`$${formatNumber(rewardInUSD)}`}</Text>
              <Text as="span">{t('unclaimed reward expiring')}</Text>
              <Text as="span" mr="4px">
                {timeRemaining > 0 ? (
                  <Text bold as="span" ml="4px">
                    {t('in')}
                    {timeUntil.months ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.months}${t('m')}`}
                      </Text>
                    ) : null}
                    {timeUntil.days ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.days}${t('d')}`}
                      </Text>
                    ) : null}
                    {timeUntil.days || timeUntil.hours ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.hours}${t('h')}`}
                      </Text>
                    ) : null}
                    <Text bold as="span" ml="4px">
                      {`${timeUntil.minutes}${t('m')}`}
                    </Text>
                  </Text>
                ) : null}
              </Text>
            </MessageText>
          </Message>
        </GreyCard>
      )}

      <VeCometPreviewTextInfo mb="24px" endTime={endTime} thresholdLockAmount={thresholdLockAmount} />

      {status === CometLockStatus.NotLocked || !cometLocked ? (
        <VeCometButtonWithMessage
          messageText={t('Get veCOMET to start earning')}
          buttonText={t('Get veCOMET')}
          onClick={onPresentNoLockingCometModal}
        />
      ) : cometLockExpired ? (
        <VeCometButtonWithMessage
          messageText={t(
            'Your COMET staking position is expired. Unlock your position and set up a new one to start earning.',
          )}
          buttonText={t('Unlock')}
          onClick={handleUnlockButton}
        />
      ) : (
        <VeCometButtonWithMessage
          messageText={t('Increase veCOMET to reach min. requirement')}
          buttonText={t('Increase veCOMET')}
          onClick={onPresentVeCometAddCometModal}
        />
      )}
    </Flex>
  )
}
