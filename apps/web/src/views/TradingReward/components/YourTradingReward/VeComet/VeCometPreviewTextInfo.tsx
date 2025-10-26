import { useTranslation } from '@cometswap/localization'
import { Box, BoxProps, Button, Flex, Text, useMatchBreakpoints, useModal } from '@cometswap/uikit'
import { formatNumber, getBalanceAmount, getBalanceNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useMemo } from 'react'
import { useVeCometUserCreditWithTime } from 'views/CometStaking/hooks/useVeCometUserCreditWithTime'
import { useCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { NoLockingCometModal } from 'views/TradingReward/components/YourTradingReward/VeComet/NoLockingCometModal'
import {
  VeCometAddCometOrWeeksModal,
  VeCometModalView,
} from 'views/TradingReward/components/YourTradingReward/VeComet/VeCometAddCometOrWeeksModal'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface VeCometPreviewTextInfoProps extends BoxProps {
  thresholdLockAmount: number
  endTime: number
  showIncreaseButton?: boolean
}

interface TextInfoProps extends BoxProps {
  title: string
  value: string
  bold?: boolean
}

const TextInfo: React.FC<React.PropsWithChildren<TextInfoProps>> = (props) => {
  const { title, value, bold } = props
  const { isDesktop, isTablet } = useMatchBreakpoints()

  return (
    <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between" {...props}>
      <Text maxWidth={['100%', '100%', '100%', '170px']} lineHeight="120%" color="textSubtle" fontSize="14px">
        {title}
      </Text>
      <Text bold={bold} style={{ alignSelf: isTablet || isDesktop ? 'center' : 'flex-start' }}>
        {value}
      </Text>
    </Flex>
  )
}

export const VeCometPreviewTextInfo: React.FC<React.PropsWithChildren<VeCometPreviewTextInfoProps>> = (props) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { endTime, thresholdLockAmount, showIncreaseButton } = props
  const { userCreditWithTime } = useVeCometUserCreditWithTime(endTime)
  const { cometPoolLocked, cometPoolLockExpired } = useCometLockStatus()

  const [onPresentVeCometAddCometModal] = useModal(
    <VeCometAddCometOrWeeksModal
      showSwitchButton
      viewMode={VeCometModalView.COMET_FORM_VIEW}
      endTime={endTime}
      thresholdLockAmount={thresholdLockAmount}
    />,
  )

  const [onPresentNoLockingCometModal] = useModal(
    <NoLockingCometModal endTime={endTime} thresholdLockAmount={thresholdLockAmount} />,
  )

  const minVeComet = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(thresholdLockAmount)), 2, 2),
    [thresholdLockAmount],
  )

  const previewVeCometAtSnapshot = useMemo(
    () => getBalanceAmount(new BigNumber(userCreditWithTime)).toFixed(2, BigNumber.ROUND_DOWN),
    [userCreditWithTime],
  )

  const onClickModal = () => {
    // Migration status
    if (cometPoolLocked && !cometPoolLockExpired) {
      onPresentNoLockingCometModal()
    } else {
      onPresentVeCometAddCometModal()
    }
  }

  return (
    <Box {...props}>
      <GreyCard>
        <TextInfo title={t('Min. veCOMET at snapshot time:')} value={minVeComet} mb="12px" />
        <TextInfo title={t('Preview of your veCOMET⌛ at snapshot time:')} value={previewVeCometAtSnapshot} mb="12px" />
        <TextInfo title={t('Snapshot at / Campaign Ends:')} value={timeFormat(locale, endTime)} />
        {showIncreaseButton && (
          <Box mt="12px">
            <Text fontSize={14} mb={12}>
              {t('Increase your veCOMET to continue earning')}
            </Text>
            <Button width="100%" onClick={onClickModal}>
              {t('Increase veCOMET')}
            </Button>
          </Box>
        )}
      </GreyCard>
    </Box>
  )
}
