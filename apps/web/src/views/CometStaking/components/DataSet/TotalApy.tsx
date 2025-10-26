import { useTranslation } from '@cometswap/localization'
import { Box, Flex, Link, Text, TooltipText, useTooltip } from '@cometswap/uikit'
import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'
import {
  BRIBE_APR,
  useVeCometPoolEmission,
  useFourYearTotalCometApr,
  useRevShareEmission,
} from 'views/CometStaking/hooks/useAPR'
import { useVeCometTotalSupply } from 'views/CometStaking/hooks/useVeCometTotalSupply'

const GradientText = styled(Text)`
  font-weight: 600;
  background: linear-gradient(269deg, #1c94e5 7.46%, #0058b9 99.29%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
interface TotalApyProps {
  Comet: string
  cakeAmount: number
  cometLockWeeks: string
}

export const TotalApy: React.FC<React.PropsWithChildren<TotalApyProps>> = ({ Comet, cakeAmount, cometLockWeeks }) => {
  const { t } = useTranslation()
  const cakePoolEmission = useVeCometPoolEmission()
  const revShareEmission = useRevShareEmission()
  const { veCOMETPoolApr, revShareEmissionApr } = useFourYearTotalCometApr()
  const { data: totalSupply } = useVeCometTotalSupply()
  // COMETPool APR
  const userCometTvl = useMemo(() => getDecimalAmount(new BigNumber(cakeAmount)), [cakeAmount])
  const userSharesPercentage = useMemo(
    () => getDecimalAmount(new BigNumber(Comet)).div(totalSupply).times(100),
    [totalSupply, Comet],
  )

  const shouldShow4yrApr = useMemo(() => cakeAmount === 0 || cometLockWeeks === '', [cakeAmount, cometLockWeeks])

  const cakePoolApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return Number(veCOMETPoolApr)
    }

    const apr = new BigNumber(userSharesPercentage)
      .times(cakePoolEmission)
      .div(3)
      .times(24 * 60 * 60 * 365)
      .div(userCometTvl.div(1e18))
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [cakePoolEmission, shouldShow4yrApr, userCometTvl, userSharesPercentage, veCOMETPoolApr])

  // Revenue Sharing
  const revenueSharingApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return Number(revShareEmissionApr)
    }

    const apr = new BigNumber(userSharesPercentage)
      .times(revShareEmission)
      .times(24 * 60 * 60 * 365)
      .div(userCometTvl)
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [revShareEmission, revShareEmissionApr, shouldShow4yrApr, userCometTvl, userSharesPercentage])

  // Bribe Apr
  const bribeApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return BRIBE_APR
    }

    return new BigNumber(BRIBE_APR).times(new BigNumber(cometLockWeeks).div(208)).toNumber()
  }, [cometLockWeeks, shouldShow4yrApr])

  const totalApy = useMemo(() => {
    const total = new BigNumber(cakePoolApr).plus(revenueSharingApr).plus(bribeApr).toNumber()
    return Number.isNaN(total) ? 0 : total
  }, [bribeApr, cakePoolApr, revenueSharingApr])

  const {
    targetRef: totalAprRef,
    tooltip: totalAprTooltips,
    tooltipVisible: totalAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          🔹{t('Total APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is the sum of veCOMETPool APR, Revenue sharing APR and Birbes APY from Guages voting.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.cometswap.finance/products/Comet/faq#why-there-are-multiple-aprs">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: vecometPoolAprRef,
    tooltip: vecometPoolAprTooltips,
    tooltipVisible: vecometPoolAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('veCOMETPool APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from COMETemission, controlled by the veCOMETPool gauge.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.cometswap.finance/products/Comet/faq#what-is-Comet-pool-apr">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: revenueSharingPoolAprRef,
    tooltip: revenueSharingPoolAprTooltips,
    tooltipVisible: revenueSharingPoolAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('Revenue Sharing APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from weekly revenue sharing from CometSwap V3.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.cometswap.finance/products/Comet/faq#what-is-revenue-sharing-apr">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: bribeAprRef,
    tooltip: bribeAprTooltips,
    tooltipVisible: bribeAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('Bribe APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from voting incentives on bribe platforms. More info on platform websites:')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://votemarket.stakedao.org/?market=comet&solution=All">
        {t('StakeDAO')}
      </Link>
      <Link mt="8px" external href="https://hiddenhand.finance/cometswap">
        {t('Hiddenhand')}
      </Link>
      <Link mt="8px" external href="https://www.comet.magpiexyz.io/Comet-bribe">
        {t('Cometpie')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex width="100%" flexDirection="column">
      <Flex justifyContent="space-between">
        <TooltipText fontSize="14px" color="textSubtle" ref={totalAprRef}>
          {t('Total APR')}
        </TooltipText>
        <Flex>
          <Text>🔹</Text>
          <GradientText>{t('Up to %apr%%', { apr: totalApy.toFixed(2) })} </GradientText>
        </Flex>
      </Flex>
      <Box ml="25px">
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={vecometPoolAprRef}>
            {t('veCOMETPool APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <Text>{t('Up to %apr%%', { apr: cakePoolApr.toFixed(2) })} </Text>
          ) : (
            <Text>{`${cakePoolApr.toFixed(2)}%`} </Text>
          )}
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={revenueSharingPoolAprRef}>
            {t('Revenue Sharing APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <Text>{t('Up to %apr%%', { apr: revenueSharingApr.toFixed(2) })} </Text>
          ) : (
            <Text>{`${revenueSharingApr.toFixed(2)}%`} </Text>
          )}
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={bribeAprRef}>
            {t('Bribe APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <GradientText>{t('Up to %apr%%', { apr: bribeApr.toFixed(2) })} </GradientText>
          ) : (
            <GradientText>{`${bribeApr.toFixed(2)}%`} </GradientText>
          )}
        </Flex>
      </Box>
      {totalAprTooltipVisible && totalAprTooltips}
      {vecometPoolAprTooltipVisible && vecometPoolAprTooltips}
      {revenueSharingPoolAprTooltipVisible && revenueSharingPoolAprTooltips}
      {bribeAprTooltipVisible && bribeAprTooltips}
    </Flex>
  )
}

