import { useTranslation } from '@cometswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Link,
  Message,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@cometswap/uikit'
import { formatBigInt, formatNumber, getBalanceAmount, getBalanceNumber } from '@cometswap/utils/formatBalance'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCometPrice } from 'hooks/useCometPrice'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { formatTime } from 'utils/formatTime'
import { CometLockStatus } from 'views/CometStaking/types'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { useProxyCometBalance } from '../hooks/useProxyCometBalance'
import { useVeCometLockStatus } from '../hooks/useVeCometUserInfo'
import { DebugTooltips, Tooltips } from './Tooltips'
import { StyledLockedCard } from './styled'

dayjs.extend(relativeTime)

const LearnMore: React.FC<{ href?: string }> = ({
  href = 'https://docs.cometswap.finance/products/Comet/migrate-from-comet-pool#10ffc408-be58-4fa8-af56-be9f74d03f42',
}) => {
  const { t } = useTranslation()
  return (
    <Link href={href} color="text" external>
      {t('Learn More >>')}
    </Link>
  )
}

export const LockedCometStatus: React.FC<{
  status: CometLockStatus
}> = ({ status }) => {
  const { t } = useTranslation()
  const { balance } = useVeCometBalance()
  const { balance: proxyBalance } = useProxyCometBalance()
  const { delegated, cometLockExpired, cakePoolLockExpired } = useVeCometLockStatus()
  const balanceBN = useMemo(() => getBalanceNumber(balance), [balance])
  const proxyComet = useMemo(() => getBalanceNumber(proxyBalance), [proxyBalance])
  const nativecomet = useMemo(() => getBalanceNumber(balance.minus(proxyBalance)), [balance, proxyBalance])

  if (status === CometLockStatus.NotLocked) return null

  const balanceText =
    balanceBN > 0 && balanceBN < 0.01 ? (
      <UnderlineText fontSize="20px" bold color={balance.eq(0) ? 'failure' : 'secondary'}>
        {getBalanceAmount(balance).sd(2).toString()}
      </UnderlineText>
    ) : (
      <UnderlinedBalance
        underlined
        fontSize="20px"
        bold
        color={balance.eq(0) ? 'failure' : 'secondary'}
        value={getBalanceNumber(balance)}
        decimals={2}
      />
    )
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My veCOMET')}</Heading>
              <Tooltips
                content={
                  proxyBalance.gt(0) ? (
                    <DualStakeTooltip nativeBalance={nativecomet} proxyBalance={proxyComet} />
                  ) : (
                    <SingleStakeTooltip />
                  )
                }
              >
                {balanceText}
              </Tooltips>
            </AutoColumn>
            <DebugTooltips
              content={
                <pre>
                  {JSON.stringify(
                    {
                      balance: balance.toString(),
                      proxyBalance: proxyBalance.toString(),
                      nativecomet: nativecomet.toString(),
                      proxyComet: proxyComet.toString(),
                      delegated,
                      cometLockExpired,
                      cakePoolLockExpired,
                    },
                    null,
                    2,
                  )}
                </pre>
              }
            >
              <img srcSet="/images/comet-staking/token-Comet.png 2x" alt="token-Comet" />
            </DebugTooltips>
          </RowBetween>
        </CardHeader>
        <NativePosition />
        <MigratePosition />
      </Card>
    </Box>
  )
}

const CUSTOM_WARNING_COLOR = '#D67E0A'

const NativePosition = () => {
  const { t } = useTranslation()
  const { cometLockExpired, cometLockedAmount, nativecometLockedAmount, cakeUnlockTime, proxyCometLockedAmount } =
    useVeCometLockStatus()

  if (!nativecometLockedAmount) return null

  return (
    <FlexGap flexDirection="column" margin={24} gap="12px">
      <RowBetween>
        <Text color="secondary" bold fontSize={12} textTransform="uppercase">
          {t('native position')}
        </Text>
        {cometLockExpired ? (
          <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
            {t('Unlocked')}
          </Tag>
        ) : null}
      </RowBetween>
      <FlexGap flexDirection="column" gap="24px">
        <StyledLockedCard gap="16px">
          <RowBetween>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('comet locked')}
              </Text>
              <CometLocked lockedAmount={nativecometLockedAmount} />
            </AutoColumn>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('unlocks in')}
              </Text>
              <CometUnlockAt expired={cometLockExpired} unlockTime={Number(cakeUnlockTime)} />
            </AutoColumn>
          </RowBetween>
        </StyledLockedCard>
        {!proxyCometLockedAmount && !cometLockExpired ? (
          <Flex justifyContent="center">
            <img src="/images/comet-staking/my-comet-bunny.png" alt="my-comet-bunny" width="254px" />
          </Flex>
        ) : null}
        {cometLockExpired ? (
          <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
            <Text as="p" color={CUSTOM_WARNING_COLOR}>
              {t(
                'Renew your veCOMETposition to continue enjoying the benefits of weekly COMETyield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
              )}
            </Text>
          </Message>
        ) : null}
      </FlexGap>
      {cometLockExpired && cometLockedAmount ? <SubmitUnlockButton /> : null}
    </FlexGap>
  )
}

const MigratePosition = () => {
  const { t } = useTranslation()
  const { cakePoolLockExpired, cakePoolUnlockTime, nativecometLockedAmount, proxyCometLockedAmount } = useVeCometLockStatus()

  if (!proxyCometLockedAmount) return null

  return (
    <FlexGap gap="12px" flexDirection="column" margin={24}>
      <RowBetween>
        <Text color="secondary" bold fontSize={12} textTransform="uppercase">
          {t('migrated position')}
        </Text>
        {cakePoolLockExpired ? (
          <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
            {t('Unlocked')}
          </Tag>
        ) : null}
      </RowBetween>
      <FlexGap flexDirection="column" gap="24px">
        <StyledLockedCard gap="16px">
          <RowBetween>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('comet locked')}
              </Text>
              <CometLocked lockedAmount={proxyCometLockedAmount} />
            </AutoColumn>
            <AutoColumn>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
                {t('unlocks in')}
              </Text>
              <CometUnlockAt expired={cakePoolLockExpired} unlockTime={Number(cakePoolUnlockTime)} />
            </AutoColumn>
          </RowBetween>
        </StyledLockedCard>

        {cakePoolLockExpired ? (
          <Message variant="warning" icon={<InfoFilledIcon color="warning" />}>
            <Text as="p">
              {t(
                'COMETPool migrated position has unlocked. Go to the pool page to withdraw, add COMETinto veCOMETto increase your veCOMETbenefits.',
              )}
            </Text>
          </Message>
        ) : nativecometLockedAmount ? (
          <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
            <AutoColumn gap="8px">
              <Text as="p">{t('Adding COMETor extending COMETwill be applying to your native position.')}</Text>
              <LearnMore href="https://docs.cometswap.finance/products/Comet/faq#52f27118-bbf3-448b-9ffe-e9e1a9dd97ef" />
            </AutoColumn>
          </Message>
        ) : (
          <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
            <AutoColumn gap="8px">
              <Text as="p">
                {t(
                  'Position migrated from COMETPool can not be extended or topped up. To extend or add more COMET, set up a native veCOMETposition.',
                )}
              </Text>
              <LearnMore />
            </AutoColumn>
          </Message>
        )}
        <Link external style={{ textDecoration: 'none', width: '100%' }} href="/pools">
          <Button width="100%" variant="secondary">
            {t('View Migrated Position')}
          </Button>
        </Link>
      </FlexGap>
    </FlexGap>
  )
}

const SingleStakeTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t('veCOMETis calculated with number of COMETlocked, and the remaining time against maximum lock time.')}
      <LearnMore />
    </>
  )
}

const DualStakeTooltip: React.FC<{
  nativeBalance: number
  proxyBalance: number
}> = ({ nativeBalance, proxyBalance }) => {
  const { t } = useTranslation()

  return (
    <>
      {t('veCOMETis calculated with number of COMETlocked, and the remaining time against maximum lock time.')}
      <br />
      <br />
      <ul>
        <li>
          {t('Native:')} {formatNumber(nativeBalance, 2, 4)} veCOMET
        </li>
        <li>
          {t('Migrated:')} {formatNumber(proxyBalance, 2, 4)} veCOMET
        </li>
      </ul>
      <br />
      <LearnMore />
    </>
  )
}

export const CometLocked: React.FC<{ lockedAmount: bigint }> = ({ lockedAmount }) => {
  const cometPrice = useCometPrice()
  const formattedComet = useMemo(() => Number(formatBigInt(lockedAmount, 18)), [lockedAmount])
  const cakeUsdValue: number = useMemo(() => {
    return cometPrice.times(formattedComet).toNumber()
  }, [cometPrice, formattedComet])

  return (
    <>
      <Balance value={formattedComet} decimals={2} fontWeight={600} fontSize={20} />
      <Balance prefix="~" value={cakeUsdValue} decimals={2} unit="USD" fontSize={12} />
    </>
  )
}

const CometUnlockAt: React.FC<{
  expired: boolean
  unlockTime: number
}> = ({ unlockTime, expired }) => {
  const { t } = useTranslation()
  const now = useCurrentBlockTimestamp()
  const unlockTimeToNow = useMemo(() => {
    return unlockTime ? dayjs.unix(unlockTime).from(dayjs.unix(now), true) : ''
  }, [now, unlockTime])

  return (
    <>
      {expired ? (
        <Text fontWeight={600} fontSize={20} color={CUSTOM_WARNING_COLOR}>
          {t('Unlocked')}
        </Text>
      ) : (
        <Text fontWeight={600} fontSize={20}>
          {unlockTimeToNow}
        </Text>
      )}

      {unlockTime ? (
        <Text fontSize={12} color={expired ? CUSTOM_WARNING_COLOR : undefined}>
          {t('on')} {formatTime(Number(dayjs.unix(unlockTime)))}
        </Text>
      ) : null}
    </>
  )
}

const UnderlinedBalance = styled(Balance).withConfig({ shouldForwardProp: (prop) => prop !== 'underlined' })<{
  underlined?: boolean
}>`
  ${({ underlined }) =>
    underlined
      ? css`
          text-decoration: underline dotted;
          text-decoration-color: ${({ theme }) => theme.colors.textSubtle};
          text-underline-offset: 0.1em;
        `
      : ''}
`

const UnderlineText = styled(Text)`
  text-decoration: underline dotted;
  text-decoration-color: currentColor;
  text-underline-offset: 0.1em;
`

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()

  return (
    <Button variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </Button>
  )
}

