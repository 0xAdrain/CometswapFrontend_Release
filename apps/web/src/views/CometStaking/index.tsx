import { useTranslation } from '@cometswap/localization'
import { Button, Grid, Heading, ModalV2, PageHeader, QuestionHelper, useMatchBreakpoints } from '@cometswap/uikit'
import { formatBigInt, formatNumber } from '@cometswap/utils/formatBalance'
import { formatAmount } from '@cometswap/utils/formatInfoNumbers'
import { CrossChainCometModal } from 'components/CrossChainCometModal'
import { CROSS_CHAIN_CONFIG } from 'components/CrossChainCometModal/constants'
import Page from 'components/Layout/Page'
import { useVeCometDistributed } from 'hooks/useVeCometDistributed'
import useTheme from 'hooks/useTheme'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { BenefitCard } from './components/BenefitCard'
import { CometRewardsCard } from './components/CometRewardsCard'
import { LockComet } from './components/LockComet'
import { PageHead } from './components/PageHead'
import { useSnapshotProposalsCount } from './hooks/useSnapshotProposalsCount'
import { useTotalIFOSold } from './hooks/useTotalIFOSold'

const CometStaking = () => {
  const { t } = useTranslation()
  const { data: gauges } = useGauges()
  const gaugesVotingCount = gauges?.length
  const snapshotProposalsCount = useSnapshotProposalsCount()
  const totalCometDistributed = useVeCometDistributed()
  const [cakeRewardModalVisible, setCometRewardModalVisible] = useState(false)
  const totalIFOSold = useTotalIFOSold()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { theme } = useTheme()
  const handleDismiss = useCallback(() => setCometRewardModalVisible(false), [])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ModalV2 isOpen={cakeRewardModalVisible} closeOnOverlayClick onDismiss={handleDismiss}>
        <CometRewardsCard onDismiss={handleDismiss} />
      </ModalV2>
      <StyledPageHeader background={isMobile ? theme.colors.gradientInverseBubblegum : undefined}>
        <PageHead />
        <LockComet />
        <Heading scale="xl" color="secondary" mt={['40px', '40px', '45px']} mb={['24px', '24px', '48px']}>
          {t('Benefits of veCOMET')}
        </Heading>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard
            type="earnComet"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Claim freshly cooked COMETrewards weekly on Thursday from veCOMETgauge emission as well as trading revenue sharing.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${formatNumber(Number(formatBigInt(totalCometDistributed)))} COMET`}
            onClick={() => {
              setCometRewardModalVisible(true)
            }}
          />
          <BenefitCard
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veCOMETto vote on your favourite farms, position managers, reward pools, and any COMETemission products, increase their allocations, and get more COMETrewards.',
                )}
                placement="top"
                ml="4px"
              />
            }
            type="gaugesVoting"
            dataText={`${gaugesVotingCount ?? 0}`}
            onClick={() => {}}
          />
        </Grid>
      </StyledPageHeader>
      <Page title={t('COMET Staking')}>
        <Heading scale="xl" mb={['24px', '24px', '48px']} mt={['16px', '16px', 0]}>
          {t('Enjoy on Every Chains')}
        </Heading>
        <Grid maxWidth="820px" gridGap="24px" gridTemplateColumns="1fr" alignItems="center" mx="auto">
          <BenefitCard
            type="crossChain"
            dataText={`${Object.keys(CROSS_CHAIN_CONFIG).length + 1}`}
            onClick={() => {
              setIsOpen(true)
            }}
            buttonSlot={
              <Button
                variant="secondary"
                width="100%"
                onClick={() => {
                  window.open(
                    'https://docs.cometswap.finance/products/Comet/bridge-your-Comet',
                    '_blank',
                    'noopener noreferrer',
                  )
                }}
              >
                {t('Learn More')}
              </Button>
            }
          />
        </Grid>
        <Heading scale="xl" mb={['24px', '24px', '48px']} mt={['16px', '16px', '32px']}>
          {t('Enjoy These Benefits')}
        </Heading>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard
            type="farmBoost"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Boost your CometSwap farming APR by up to 2.5x. Aquire more veCOMETto receive a higher boost.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText="2.5x"
          />
          <BenefitCard
            type="snapshotVoting"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use veCOMETas your Snapshot voting power to vote on governance proposals. Including important protocol decisions, and adding new farming gauges.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${snapshotProposalsCount}`}
          />
          <BenefitCard
            type="ifo"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veCOMETas your IFO Public Sales commit credits. Aquire more veCOMETto commit more in the next CometSwap IFOs.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`$${formatAmount(totalIFOSold, { notation: 'standard' })}`}
          />
          <BenefitCard type="more" />
        </Grid>
      </Page>
      <CrossChainCometModal isOpen={isOpen} setIsOpen={setIsOpen} onDismiss={() => setIsOpen(false)} />
    </>
  )
}

const StyledPageHeader = styled(PageHeader)`
  padding-top: 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 56px;
  }
`

export default CometStaking

