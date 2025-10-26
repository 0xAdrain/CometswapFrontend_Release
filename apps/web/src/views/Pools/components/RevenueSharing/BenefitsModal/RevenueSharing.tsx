import { useTranslation } from '@cometswap/localization'
import { Balance, Box, Card, Flex, LinkExternal, Message, MessageText, Text, WarningIcon } from '@cometswap/uikit'
import BigNumber from 'bignumber.js'
import { useCometPrice } from 'hooks/useCometPrice'
import { useMemo } from 'react'

import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCometVault, VaultKey } from 'state/types'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'
import ClaimButton from 'views/Pools/components/RevenueSharing/BenefitsModal/ClaimButton'
import useRevenueSharingPool from 'views/Pools/hooks/useRevenueSharingPool'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface RevenueSharingProps {
  onDismiss?: () => void
}

const RevenueSharing: React.FunctionComponent<React.PropsWithChildren<RevenueSharingProps>> = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cometPrice = useCometPrice()
  const { userData } = useVaultPoolByKey(VaultKey.CometVault) as DeserializedLockedCometVault

  const { lastDistributionTimestamp, availableClaim } = useRevenueSharingPool()

  const availableComet = useMemo(() => getBalanceAmount(new BigNumber(availableClaim)).toNumber(), [availableClaim])
  const availableCometUsdValue = useMemo(
    () => new BigNumber(availableComet).times(cometPrice).toNumber(),
    [availableComet, cometPrice],
  )

  const showNoCometAmountWarning = useMemo(
    () => new BigNumber(userData?.lockedAmount ?? '0').lte(0),
    [userData?.lockedAmount],
  )

  return (
    <Card isActive mb={['24px', '24px', '24px', '0']}>
      <Box padding={16}>
        <Text fontSize={12} bold color="secondary" textTransform="uppercase">
          {t('revenue sharing')}
        </Text>
        <Box mt="8px">
          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText
              title={t('Last distribution')}
              tooltipComponent={<Text>{t('The time of the last revenue distribution and shares update.')}</Text>}
            />
            <Text bold>{timeFormat(locale, lastDistributionTimestamp)}</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <BenefitsTooltipsText
              title={t('Available for claiming')}
              tooltipComponent={<Text>{t('Amount of revenue available for claiming in COMET.')}</Text>}
            />
            <Box>
              {availableComet > 0 && availableComet <= 0.01 ? (
                <Text bold textAlign="right">{`< 0.01 COMET`}</Text>
              ) : (
                <Balance unit=" COMET" textAlign="right" bold value={availableComet} decimals={2} />
              )}
              <Balance
                ml="4px"
                color="textSubtle"
                fontSize={12}
                textAlign="right"
                lineHeight="110%"
                prefix="(~ $"
                unit=")"
                value={availableCometUsdValue}
                decimals={2}
              />
            </Box>
          </Flex>
        </Box>
        {showNoCometAmountWarning && (
          <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
            <MessageText lineHeight="120%">
              {t('You need to update your staking in order to start earning from protocol revenue sharing.')}
            </MessageText>
          </Message>
        )}
        <ClaimButton availableClaim={availableClaim} onDismiss={onDismiss} />
        <LinkExternal external m="8px auto auto auto" href="https://docs.cometswap.finance/products/revenue-sharing">
          {t('Learn More')}
        </LinkExternal>
      </Box>
    </Card>
  )
}

export default RevenueSharing

