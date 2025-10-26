import { useTranslation } from '@cometswap/localization'
import { ONE_WEEK_DEFAULT } from '@cometswap/pools'
import {
  AtomBox,
  Balance,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  LinkExternal,
  Message,
  MessageText,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Row,
  Text,
  WarningIcon,
  useMatchBreakpoints,
  useToast,
} from '@cometswap/uikit'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import getTimePeriods from '@cometswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCometPrice } from 'hooks/useCometPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRevenueSharingPoolGatewayContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { getRevenueSharingCometPoolAddress, getRevenueSharingCometAddress } from 'utils/addressHelpers'
import { stringify } from 'viem'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { poolStartWeekCursors } from 'views/CometStaking/config'
import { WEEK } from 'config/constants/Comet'
import {
  useVeCometPoolEmission,
  useRevShareEmission,
  useUserCometTVL,
  useUserSharesPercent,
  useVeCometAPR,
} from '../hooks/useAPR'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { useRevenueSharingCometPool, useRevenueSharingComet } from '../hooks/useRevenueSharingProxy'
import { MyCometCard } from './MyCometCard'
import { useVeCometLockStatus } from '../hooks/useVeCometUserInfo'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

const APRDebugView = () => {
  const cakePoolEmission = useVeCometPoolEmission()
  const userSharesPercent = useUserSharesPercent()
  const userCometTVL = useUserCometTVL()
  const revShareEmission = useRevShareEmission()
  const { cakePoolAPR, revenueSharingAPR, totalAPR } = useVeCometAPR()
  if (!(window?.location?.hostname === 'localhost' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview')) return null
  return (
    <Flex mt="8px" flexDirection="row" alignItems="center">
      <BenefitsTooltipsText
        title="APR DebugView"
        tooltipComponent={
          <pre>
            {stringify(
              {
                cakePoolAPR: cakePoolAPR?.toSignificant(18),
                revenueSharingAPR: revenueSharingAPR?.toSignificant(18),
                totalAPR: totalAPR?.toSignificant(18),
                cakePoolEmission: cakePoolEmission?.toString(),
                userSharesPercent: userSharesPercent?.toSignificant(18),
                userCometTVL: userCometTVL?.toString(),
                revShareEmission: revShareEmission?.toString(),
              },
              null,
              2,
            )}
          </pre>
        }
      />
    </Flex>
  )
}

// @notice
// migrate from: apps/web/src/views/Pools/components/RevenueSharing/BenefitsModal/RevenueSharing.tsx
export const CometRewardsCard = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const cometPrice = useCometPrice()
  const { cakeUnlockTime, cometLockedAmount } = useVeCometLockStatus()
  const { balanceOfAt, totalSupplyAt, nextDistributionTimestamp, lastDistributionTimestamp, availableClaim } =
    useRevenueSharingComet()
  const yourShare = useMemo(() => getBalanceAmount(new BigNumber(balanceOfAt)).toNumber(), [balanceOfAt])
  const yourSharePercentage = useMemo(
    () => new BigNumber(balanceOfAt).div(totalSupplyAt).times(100).toNumber() || 0,
    [balanceOfAt, totalSupplyAt],
  )

  const showYourSharePercentage = useMemo(() => new BigNumber(totalSupplyAt).gt(0), [totalSupplyAt])

  const { availableClaim: availableClaimFromCometPool } = useRevenueSharingCometPool()
  const availableCometPoolComet = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaimFromCometPool)).toNumber(),
    [availableClaimFromCometPool],
  )
  const availableCometPoolCometUsdValue = useMemo(
    () => new BigNumber(availableCometPoolComet).times(cometPrice).toNumber(),
    [availableCometPoolComet, cometPrice],
  )

  const availableRevenueSharingComet = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaim)).toNumber(),
    [availableClaim],
  )
  const availableRevenueSharingCometUsdValue = useMemo(
    () => new BigNumber(availableRevenueSharingComet).times(cometPrice).toNumber(),
    [availableRevenueSharingComet, cometPrice],
  )

  const totalAvailableClaim = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaim).plus(availableClaimFromCometPool)).toNumber(),
    [availableClaim, availableClaimFromCometPool],
  )
  const totalAvailableClaimUsdValue = useMemo(
    () => new BigNumber(totalAvailableClaim).times(cometPrice).toNumber(),
    [totalAvailableClaim, cometPrice],
  )

  const showExpireSoonWarning = useMemo(() => {
    const endTime = new BigNumber(nextDistributionTimestamp).plus(ONE_WEEK_DEFAULT)
    return new BigNumber(cakeUnlockTime ?? '0').lt(endTime)
  }, [nextDistributionTimestamp, cakeUnlockTime])

  const showNoCometAmountWarning = cometLockedAmount <= 0
  const currentDate = useCurrentBlockTimestamp()
  // const currentDate = Date.now() / 1000
  const timeRemaining = nextDistributionTimestamp - Number(currentDate || 0)
  const { days, hours, minutes, seconds } = getTimePeriods(timeRemaining)

  const nextDistributionTime = useMemo(() => {
    if (!days && hours && minutes && seconds) {
      return `< 1 ${t('day')}`
    }

    return t('in %day% days', { day: days })
  }, [days, hours, minutes, seconds, t])

  const { cakePoolAPR, revenueSharingAPR, totalAPR } = useVeCometAPR()

  return (
    <ModalContainer
      title={t('COMETReward / Yield')}
      style={{ minWidth: '375px', padding: isDesktop ? '24px' : '24px 24px 0 24px' }}
    >
      <AtomBox
        justifyContent="space-between"
        bg="gradientBubblegum"
        p="24px"
        maxWidth="420px"
        height="100%"
        style={{ margin: '-24px' }}
      >
        <StyledModalHeader headerBorderColor="transparent">
          <ModalTitle>
            <Heading scale="md">{t('COMETReward / Yield')}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </StyledModalHeader>

        <ModalBody style={{ marginLeft: '-24px', marginRight: '-24px', paddingLeft: '24px', paddingRight: '24px' }}>
          <Row>
            <Text fontSize="16px" bold color="secondary">
              {t('EARN COMET')}
            </Text>
            <Text fontSize="16px" bold color="textSubtle" ml="3px">
              {t('WEEKLY')}
            </Text>
          </Row>
          <Text fontSize="14px" color="textSubtle" mb="16px" mt="13px">
            {t('From COMETpool rewards and revenue sharing!')}
          </Text>
          <MyCometCard />
          <Card mt="16px" style={{ overflow: 'unset' }} mb={isDesktop ? '0' : '24px'}>
            <Box padding={16}>
              <Box>
                <Flex flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Your shares')}
                    tooltipComponent={
                      <>
                        <Text>
                          {t('The virtual shares you currently own and the % against the whole revenue sharing pool.')}
                        </Text>
                        <Text m="4px 0">
                          {t(
                            'Please note that after locking or updating, your shares will only update upon revenue distributions.',
                          )}
                        </Text>
                        <LinkExternal href="https://docs.cometswap.finance/products/revenue-sharing/faq#50b7c683-feb0-47f6-809f-39c1a0976bb5">
                          <Text bold color="primary">
                            {t('Learn More')}
                          </Text>
                        </LinkExternal>
                      </>
                    }
                  />
                  <Box>
                    {yourShare === 0 ? (
                      <Text bold color="failure">
                        0
                      </Text>
                    ) : (
                      <>
                        {yourShare <= 0.01 ? (
                          <Text as="span" bold>{`< 0.01`}</Text>
                        ) : (
                          <Balance
                            display="inline-block"
                            color="success"
                            fontWeight={800}
                            value={yourShare}
                            decimals={5}
                          />
                        )}
                        {showYourSharePercentage && (
                          <>
                            {yourSharePercentage <= 0.01 ? (
                              <Text as="span" ml="4px">{`(< 0.01%)`}</Text>
                            ) : (
                              <Balance
                                display="inline-block"
                                prefix="("
                                unit="%)"
                                ml="4px"
                                value={yourSharePercentage}
                                decimals={5}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Flex>

                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Next distribution')}
                    tooltipComponent={
                      <Text>{t('Time remaining until the next revenue distribution and share updates.')}</Text>
                    }
                  />
                  <Text color={showExpireSoonWarning ? 'failure' : 'text'} bold>
                    {nextDistributionTime}
                  </Text>
                </Flex>

                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Last distribution')}
                    tooltipComponent={<Text>{t('The time of the last revenue distribution and shares update.')}</Text>}
                  />
                  <Text bold>{timeFormat(locale, lastDistributionTimestamp)}</Text>
                </Flex>
                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('APR')}
                    tooltipComponent={
                      <div>
                        <p>
                          {t('COMETPool:')}{' '}
                          <Text bold style={{ display: 'inline' }}>
                            {cakePoolAPR.toFixed(2)}%
                          </Text>
                        </p>
                        <p>
                          {t('Revenue Sharing:')}{' '}
                          <Text bold style={{ display: 'inline' }}>
                            {revenueSharingAPR.toFixed(2)}%
                          </Text>
                        </p>
                        <br />
                        <p>
                          {t(
                            'The veCOMETPool APR is calculated based on the emission speed which is defined by the voting result of the veCOMETPool gauge in Gauges Voting.',
                          )}
                        </p>
                        <br />
                        <p>
                          {t(
                            'Revenue Sharing APR is subject to various external factors, including trading volume, and could vary weekly.',
                          )}
                        </p>
                      </div>
                    }
                  />
                  <Text bold>{totalAPR.toFixed(2)}%</Text>
                </Flex>

                <APRDebugView />

                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('comet pool')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in COMET.')}</Text>}
                    />
                    <Box>
                      {availableCometPoolComet > 0 && availableCometPoolComet <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 COMET`}</Text>
                      ) : (
                        <Balance unit=" COMET" textAlign="right" bold value={availableCometPoolComet} decimals={5} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableCometPoolCometUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('revenue sharing')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in COMET.')}</Text>}
                    />
                    <Box>
                      {availableRevenueSharingComet > 0 && availableRevenueSharingComet <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 COMET`}</Text>
                      ) : (
                        <Balance unit=" COMET" textAlign="right" bold value={availableRevenueSharingComet} decimals={5} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableRevenueSharingCometUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('total')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Available for claiming')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in COMET.')}</Text>}
                    />
                    <Box>
                      {totalAvailableClaim > 0 && totalAvailableClaim <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 COMET`}</Text>
                      ) : (
                        <Balance unit=" COMET" textAlign="right" bold value={totalAvailableClaim} decimals={5} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={totalAvailableClaimUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Box>
              {showNoCometAmountWarning && (
                <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
                  <MessageText lineHeight="120%">
                    {t('You need to update your staking in order to start earning from protocol revenue sharing.')}
                  </MessageText>
                </Message>
              )}
              <ClaimButton availableClaim={availableClaim} onDismiss={onDismiss} />
              <LinkExternal
                external
                m="8px auto auto auto"
                href="https://docs.cometswap.finance/products/revenue-sharing"
              >
                {t('Learn More')}
              </LinkExternal>
            </Box>
          </Card>
        </ModalBody>
      </AtomBox>
    </ModalContainer>
  )
}

const ClaimButton: React.FC<{
  availableClaim: string
  onDismiss?: () => void
}> = ({ availableClaim, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolGatewayContract()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const isReady = useMemo(() => new BigNumber(availableClaim).gt(0) && !isPending, [availableClaim, isPending])

  const handleClaim = useCallback(async () => {
    try {
      if (!account || !chainId || !currentBlockTimestamp) return

      const cakePoolAddress = getRevenueSharingCometPoolAddress(chainId)
      const cakePoolLength = Math.ceil((currentBlockTimestamp - poolStartWeekCursors[cakePoolAddress]) / WEEK / 52)
      const vecometAddress = getRevenueSharingCometAddress(chainId)
      const vecometPoolLength = Math.ceil((currentBlockTimestamp - poolStartWeekCursors[vecometAddress]) / WEEK / 52)

      const revenueSharingPools = [
        ...Array(cakePoolLength).fill(cakePoolAddress),
        ...Array(vecometPoolLength).fill(vecometAddress),
      ]
      const receipt = await fetchWithCatchTxError(() =>
        contract.write.claimMultiple([revenueSharingPools, account], { account, chain: contract.chain }),
      )

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully claimed your rewards.')}
          </ToastDescriptionWithTx>,
        )

        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit Revenue Claim Button', error)
    }
  }, [
    account,
    chainId,
    contract.chain,
    contract.write,
    fetchWithCatchTxError,
    onDismiss,
    t,
    toastSuccess,
    currentBlockTimestamp,
  ])

  return (
    <Button mt="24px" width="100%" variant="subtle" disabled={!isReady} onClick={handleClaim}>
      {t('Claim All')}
    </Button>
  )
}

