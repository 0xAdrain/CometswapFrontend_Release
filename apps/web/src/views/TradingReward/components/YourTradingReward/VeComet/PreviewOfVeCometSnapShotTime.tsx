import { useTranslation } from '@cometswap/localization'
import { Box, CheckmarkCircleFillIcon, ErrorIcon, Flex, Image, Text } from '@cometswap/uikit'
import { getBalanceAmount, getDecimalAmount } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ASSET_CDN } from 'config/constants/endpoints'
import { WEEK } from 'config/constants/veComet'
import { useMemo } from 'react'
import { useLockCometData } from 'state/vecomet/hooks'
import { styled } from 'styled-components'
import { getVeCometAmount } from 'utils/getVeCometAmount'
import { useProxyVeCometBalanceOfAtTime } from 'views/CometStaking/hooks/useProxyVeCometBalanceOfAtTime'
import { useTargetUnlockTime } from 'views/CometStaking/hooks/useTargetUnlockTime'
import { useCometLockStatus, useVeCometUserInfo } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { CometLockStatus } from 'views/CometStaking/types'
import { VeCometModalView } from 'views/TradingReward/components/YourTradingReward/VeComet/VeCometAddCometOrWeeksModal'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

const SnapShotTimeContainer = styled(Flex)<{ $isValid: boolean }>`
  width: 100%;
  flex-direction: column;
  padding: 16px;
  border-radius: 24px;
  border: ${({ $isValid, theme }) => ($isValid ? '2px dashed #e7e3eb' : `1px solid ${theme.colors.warning}`)};
  background-color: ${({ theme, $isValid }) => ($isValid ? theme.colors.tertiary : 'rgba(255, 178, 55, 0.10)')};
`

interface PreviewOfVeCometSnapShotTimeProps {
  viewMode?: VeCometModalView
  endTime: number
  thresholdLockAmount: number
}

export const PreviewOfVeCometSnapShotTime: React.FC<React.PropsWithChildren<PreviewOfVeCometSnapShotTimeProps>> = ({
  viewMode,
  endTime,
  thresholdLockAmount,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { data: userInfo } = useVeCometUserInfo()
  const { cometLockAmount, cometLockWeeks } = useLockCometData()
  const { cometUnlockTime, cometLockExpired, nativeCometLockedAmount, status, cometLocked } = useCometLockStatus()
  const { balance: proxyVeCometBalanceOfAtTime } = useProxyVeCometBalanceOfAtTime(endTime)

  const unlockTimestamp = useTargetUnlockTime(
    Number(cometLockWeeks) * WEEK,
    cometLockExpired || status === CometLockStatus.NotLocked || !cometLocked ? undefined : Number(cometUnlockTime),
  )

  const veCometAmount = useMemo(() => {
    const cometAmountBN = cometLockAmount ? getDecimalAmount(new BigNumber(cometLockAmount)) : 0
    const unlockTimeInSec = endTime > unlockTimestamp ? 0 : new BigNumber(unlockTimestamp).minus(endTime).toNumber()
    const endTimeInSec = new BigNumber(endTime).gt(userInfo?.end?.toString() ?? 0)
      ? 0
      : new BigNumber(userInfo?.end?.toString() ?? 0).minus(endTime).toNumber()

    if (status === CometLockStatus.NotLocked || !cometLocked) {
      const veCometAmountFromNative = getVeCometAmount(cometAmountBN.toString(), unlockTimeInSec)
      return getBalanceAmount(proxyVeCometBalanceOfAtTime.plus(veCometAmountFromNative))
    }

    if (viewMode === VeCometModalView.WEEKS_FORM_VIEW) {
      return getBalanceAmount(
        proxyVeCometBalanceOfAtTime.plus(getVeCometAmount(nativeCometLockedAmount.toString(), unlockTimeInSec)),
      )
    }

    const newLockCometAmount = getBalanceAmount(new BigNumber(nativeCometLockedAmount.toString()).plus(cometAmountBN))
    return getBalanceAmount(proxyVeCometBalanceOfAtTime).plus(
      getVeCometAmount(newLockCometAmount.toString(), endTimeInSec),
    )
  }, [
    cometLockAmount,
    endTime,
    unlockTimestamp,
    userInfo?.end,
    status,
    cometLocked,
    viewMode,
    nativeCometLockedAmount,
    proxyVeCometBalanceOfAtTime,
  ])

  const previewVeComet = useMemo(
    () => (veCometAmount?.lt(0.1) ? veCometAmount.sd(2).toString() : veCometAmount?.toFixed(2)),
    [veCometAmount],
  )

  const valid = useMemo(
    () => new BigNumber(veCometAmount).gte(getBalanceAmount(new BigNumber(thresholdLockAmount))),
    [thresholdLockAmount, veCometAmount],
  )

  return (
    <SnapShotTimeContainer $isValid={valid}>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent={['space-between']}>
        <Box>
          <Text bold as="span" color="textSubtle" fontSize={12}>
            {t('Preview of')}
          </Text>
          <Text bold as="span" color="secondary" ml="4px" fontSize={12}>
            {t('*veCOMET at snapshot time:')}
          </Text>
        </Box>
        <Text>{timeFormat(locale, endTime)}</Text>
      </Flex>
      <Flex justifyContent={['space-between']}>
        <Flex>
          <Box width={39}>
            <Image
              width={39}
              height={39}
              alt="trading-reward-vecomet"
              src={`${ASSET_CDN}/web/vecomet/token-vecomet-with-time.png`}
            />
          </Box>
          <Text style={{ alignSelf: 'center' }} bold ml="8px" fontSize="20px">
            {`${t('veCOMET')}⌛`}
          </Text>
        </Flex>
        <Flex>
          <Text bold mr="4px" fontSize="20px" color={valid ? 'text' : 'warning'} style={{ alignSelf: 'center' }}>
            {previewVeComet}
          </Text>
          {valid ? <CheckmarkCircleFillIcon color="success" width={24} /> : <ErrorIcon color="warning" width={24} />}
        </Flex>
      </Flex>
      {valid ? (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="success">
          {t('Min. veCOMET will be reached at snapshot time')}
        </Text>
      ) : (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="warning">
          {t('Min. veCOMET won’t be reached at snapshot time')}
        </Text>
      )}
    </SnapShotTimeContainer>
  )
}
