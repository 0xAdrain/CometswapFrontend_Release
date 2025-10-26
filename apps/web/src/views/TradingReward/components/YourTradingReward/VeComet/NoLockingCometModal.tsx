import { useTranslation } from '@cometswap/localization'
import { Box, InjectedModalProps, Modal, Text } from '@cometswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { WEEK } from 'config/constants/veComet'
import React, { useMemo } from 'react'
import { useLockCometData } from 'state/vecomet/hooks'
import { styled } from 'styled-components'
import { DataRow } from 'views/CometStaking/components/DataSet/DataBox'
import { NotLockingCard } from 'views/CometStaking/components/LockComet/NotLocking'
import { useProxyVeCometBalance } from 'views/CometStaking/hooks/useProxyVeCometBalance'
import { useTargetUnlockTime } from 'views/CometStaking/hooks/useTargetUnlockTime'
import { useVeCometAmount } from 'views/CometStaking/hooks/useVeCometAmount'
import { PreviewOfVeCometSnapShotTime } from 'views/TradingReward/components/YourTradingReward/VeComet/PreviewOfVeCometSnapShotTime'

const StyledModal = styled(Modal)`
  > div > div > div > div:first-child > div {
    margin-top: 0;
  }

  > div > div > div > div:first-child > div:first-child {
    padding-top: 0;
  }

  > div > div > div > div:first-child > div:nth-child(2) {
    padding-left: 0px;

    ${({ theme }) => theme.mediaQueries.sm} {
      padding-left: 16px;
    }
  }
`

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

interface NoLockingCometModalProps extends InjectedModalProps {
  thresholdLockAmount: number
  endTime: number
}

export const NoLockingCometModal: React.FC<React.PropsWithChildren<NoLockingCometModalProps>> = ({
  endTime,
  thresholdLockAmount,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { cometLockAmount, cometLockWeeks } = useLockCometData()
  const unlockTimestamp = useTargetUnlockTime(Number(cometLockWeeks) * WEEK)
  const cometAmountBN = useMemo(
    () => getDecimalAmount(new BigNumber(Number(cometLockAmount))).toString(),
    [cometLockAmount],
  )
  const { balance: proxyVeCometBalance } = useProxyVeCometBalance()
  const veCometAmountFromNative = useVeCometAmount(cometAmountBN, unlockTimestamp)

  const veCometAmount = useMemo(
    () => proxyVeCometBalance.plus(veCometAmountFromNative),
    [proxyVeCometBalance, veCometAmountFromNative],
  )
  const veComet = veCometAmount ? getFullDisplayBalance(new BigNumber(veCometAmount), 18, 3) : '0'

  return (
    <StyledModal
      width="100%"
      title={t('Lock COMET to get veCOMET')}
      headerBorderColor="transparent"
      maxWidth={['100%', '100%', '100%', '777px']}
      onDismiss={onDismiss}
    >
      <Box width="100%" overflowX="auto">
        <NotLockingCard
          hideTitle
          hideCardPadding
          customVeCometCard={<PreviewOfVeCometSnapShotTime endTime={endTime} thresholdLockAmount={thresholdLockAmount} />}
          customDataRow={
            <DataRow
              label={
                <Text fontSize={14} color="textSubtle" style={{ textTransform: 'initial' }}>
                  {t('veCOMET')}
                </Text>
              }
              value={<ValueText>{veComet}</ValueText>}
            />
          }
          onDismiss={onDismiss}
        />
      </Box>
    </StyledModal>
  )
}
