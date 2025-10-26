import { Box, Flex, Text, useMatchBreakpoints } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import styled from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'

const Container = styled(Box)<{ bgColor: string }>`
  background: ${({ bgColor }) => bgColor};
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => 
      theme.isDark 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(255, 255, 255, 0.1)'
    };
    backdrop-filter: blur(10px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const Content = styled(Box)`
  position: relative;
  z-index: 1;
`

const Header = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-direction: column;
  gap: 8px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`

const CycleName = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const PayoutAmount = styled(Text)<{ hasAmount: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ hasAmount }) => hasAmount ? '#22c55e' : 'rgba(255, 255, 255, 0.7)'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
  }
`

const StatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`

const StatItem = styled(Box)`
  text-align: center;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`

const StatLabel = styled(Text)`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`

const StatValue = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const ProgressSection = styled(Box)`
  margin-top: 16px;
`

const ProgressHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const ProgressLabel = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const ProgressValue = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 10px;
    
    &::after {
      border-radius: 5px;
    }
  }
`

const NoStakesText = styled(Text)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

interface PayoutCycle {
  id: string
  name: string
  duration: number
  globalPayout: number
  userEstimate: number
  nextPayoutDay: number
  progress: number
  color: string
}

interface PayoutCycleCardProps {
  cycle: PayoutCycle
}

const PayoutCycleCard: React.FC<PayoutCycleCardProps> = ({ cycle }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '$0'
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`
    }
    return `$${formatNumber(amount, 2, 2)}`
  }

  const formatETH = (amount: number) => {
    if (amount === 0) return '0 ETH'
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M ETH`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K ETH`
    }
    return `${formatNumber(amount, 2, 2)} ETH`
  }

  return (
    <Container bgColor={cycle.color}>
      <Content>
        <Header>
          <CycleName>{cycle.name}</CycleName>
          <PayoutAmount hasAmount={cycle.globalPayout > 0}>
            {formatCurrency(cycle.globalPayout)}
          </PayoutAmount>
        </Header>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('Global Cycle Payout')}</StatLabel>
            <StatValue>{formatCurrency(cycle.globalPayout)}</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>{t('Your Est. Payout')}</StatLabel>
            <StatValue>
              {cycle.userEstimate > 0 ? formatETH(cycle.userEstimate) : (
                <NoStakesText>{t('No Stakes')}</NoStakesText>
              )}
            </StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>{t('Countdown')}</StatLabel>
            <StatValue>{t('Next Payout Day: %day%', { day: cycle.nextPayoutDay })}</StatValue>
          </StatItem>
        </StatsGrid>

        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>{t('Countdown')}</ProgressLabel>
            <ProgressValue>{cycle.progress}%</ProgressValue>
          </ProgressHeader>
          <ProgressBar progress={cycle.progress} />
        </ProgressSection>
      </Content>
    </Container>
  )
}

export default PayoutCycleCard





