import { Box, Flex, Text, Button, Progress, useMatchBreakpoints } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import styled, { keyframes, css } from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
  }
`

const Container = styled(Box)`
  padding: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const Header = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`

const CycleInfo = styled(Box)`
  flex: 1;
`

const CycleName = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const CycleDetails = styled(Flex)`
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
`

const DetailBadge = styled(Box)<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.1) 100%)'
      case 'success':
        return theme.isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
      default:
        return theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    }
  }};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return '#8a2be2'
      case 'success':
        return '#22c55e'
      default:
        return theme.colors.textSubtle
    }
  }};
  border: 1px solid
    ${({ theme, variant }) => {
      switch (variant) {
        case 'primary':
          return 'rgba(138, 43, 226, 0.3)'
        case 'success':
          return 'rgba(34, 197, 94, 0.3)'
        default:
          return theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    }};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 8px;
  }
`

const StakeButton = styled(Button)`
  background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  height: 40px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #9932cc 0%, #5d1a8b 100%);
    ${css`
      animation: ${pulseGlow} 1.5s infinite;
    `}
  }

  &:active {
    transform: translateY(0);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
    padding: 12px 24px;
    height: 48px;
    border-radius: 12px;
  }
`

const StatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`

const StatCard = styled(Box)`
  background: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)')};
  border-radius: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px;
    border-radius: 12px;
  }
`

const StatLabel = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 4px;
  font-weight: 500;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`

const StatValue = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const ProgressSection = styled(Box)`
  margin-bottom: 16px;
`

const ProgressHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const ProgressLabel = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 500;
`

const ProgressValue = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: #8a2be2;
`

const CustomProgress = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
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
    background: linear-gradient(90deg, #8a2be2 0%, #4b0082 100%);
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
`

interface StakingCycle {
  id: string
  name: string
  duration: number
  globalPool: number
  userEstimate: number
  nextPayoutDay: number
  progress: number
  apy: number
  minStake: number
}

interface StakingCycleCardProps {
  cycle: StakingCycle
  onStakeClick: () => void
}

const StakingCycleCard: React.FC<StakingCycleCardProps> = ({ cycle, onStakeClick }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${formatNumber(amount, 0, 0)}`
  }

  const formatToken = (amount: number) => {
    return `${formatNumber(amount, 0, 0)} COMET`
  }

  return (
    <Container>
      <Header>
        <CycleInfo>
          <CycleName>{cycle.name}</CycleName>
          <CycleDetails>
            <DetailBadge variant="primary">APY {cycle.apy}%</DetailBadge>
            <DetailBadge>Min: {formatToken(cycle.minStake)}</DetailBadge>
            <DetailBadge variant="success">{cycle.duration} Days</DetailBadge>
          </CycleDetails>
        </CycleInfo>

        <StakeButton onClick={onStakeClick}>{t('Stake COMET')}</StakeButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatLabel>{t('Global Pool')}</StatLabel>
          <StatValue>{formatCurrency(cycle.globalPool)}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>{t('Your Estimate')}</StatLabel>
          <StatValue>{cycle.userEstimate > 0 ? formatCurrency(cycle.userEstimate) : '$0'}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>{t('Next Payout')}</StatLabel>
          <StatValue>{t('Day %day%', { day: cycle.nextPayoutDay })}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>{t('Cycle Progress')}</StatLabel>
          <StatValue>{cycle.progress}%</StatValue>
        </StatCard>
      </StatsGrid>

      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>{t('Cycle Progress')}</ProgressLabel>
          <ProgressValue>{cycle.progress}%</ProgressValue>
        </ProgressHeader>
        <CustomProgress progress={cycle.progress} />
      </ProgressSection>
    </Container>
  )
}

export default StakingCycleCard
