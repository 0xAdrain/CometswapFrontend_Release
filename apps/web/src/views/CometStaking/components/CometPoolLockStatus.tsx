import { useTranslation } from '@cometswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Message,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@cometswap/uikit'
import { formatBigInt } from '@cometswap/utils/formatBalance'
import { WEEK } from 'config/constants/Comet'
import dayjs from 'dayjs'
import { useCometPrice } from 'hooks/useCometPrice'
import { useMemo } from 'react'
import { formatTime } from 'utils/formatTime'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useVeCometPoolLockInfo } from '../hooks/useVeCometPoolLockInfo'
import { useWriteMigrateCallback } from '../hooks/useContractWrite/useWriteMigrateCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { StyledLockedCard } from './styled'

dayjs.extend(relativeTime)

export const CometPoolLockInfo = () => {
  const { t } = useTranslation()
  const { lockedAmount = 0n, lockEndTime = 0n } = useVeCometPoolLockInfo()
  const roundedEndTime = useMemo(() => {
    return Math.floor(Number(lockEndTime) / WEEK) * WEEK
  }, [lockEndTime])
  const cometPrice = useCometPrice()
  const cometAmount = useMemo(() => Number(formatBigInt(lockedAmount)), [lockedAmount])
  const cometAmountUsdValue = useMemo(() => {
    return cometPrice.times(cometAmount).toNumber()
  }, [cometPrice, cometAmount])
  const now = useCurrentBlockTimestamp()
  const unlockTimeToNow = useMemo(() => {
    return dayjs.unix(now).from(dayjs.unix(Number(roundedEndTime || 0)), true)
  }, [now, roundedEndTime])
  const migrate = useWriteMigrateCallback()

  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      <RowBetween>
        <Text color="secondary" bold fontSize={12} textTransform="uppercase">
          {t('migrated position')}
        </Text>
        <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
          {t('Migration Needed')}
        </Tag>
      </RowBetween>
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('comet locked')}
            </Text>
            <Balance value={cometAmount} decimals={2} fontWeight={600} fontSize={20} />
            <Balance prefix="~" value={cometAmountUsdValue} decimals={2} unit="USD" fontSize={12} />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            <Text fontWeight={600} fontSize={20}>
              {unlockTimeToNow}
            </Text>
            <Text fontSize={12}>
              {t('on')} {formatTime(Number(dayjs.unix(Number(roundedEndTime || 0))))}
            </Text>
          </AutoColumn>
        </RowBetween>
        <Button width="100%" onClick={migrate}>
          {t('Migrate to veCOMET')}
        </Button>
      </StyledLockedCard>
      <Message variant="warning" icon={<InfoFilledIcon color="#D67E0A" />}>
        <Text as="p" color="#D67E0A">
          {t(
            'Migrate your COMETstaking position to veCOMETand enjoy the benefits of weekly COMETyield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
          )}
        </Text>
      </Message>
    </FlexGap>
  )
}

export const CometPoolLockStatus = () => {
  const { t } = useTranslation()
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My veCOMET')}</Heading>
              <Balance fontSize="20px" bold color="failure" value={0} decimals={2} />
            </AutoColumn>
            <img srcSet="/images/comet-staking/token-Comet.png 2x" alt="token-Comet" />
          </RowBetween>
        </CardHeader>
        <CometPoolLockInfo />
      </Card>
    </Box>
  )
}

