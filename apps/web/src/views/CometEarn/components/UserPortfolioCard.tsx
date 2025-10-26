import { Box, Flex, Text, Button, useMatchBreakpoints } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import styled, { keyframes, css } from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
  }
`

const Container = styled(Box)`
  padding: 24px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 32px;
  }
`

const Title = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`

const StatsRow = styled(Flex)`
  gap: 16px;
  margin-bottom: 24px;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const StatGroup = styled(Flex)`
  gap: 24px;
  flex-direction: column;
  flex: 1;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 32px;
  }
`

const StatItem = styled(Box)`
  flex: 1;
`

const StatLabel = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 4px;
  font-weight: 500;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const StatValue = styled(Text)<{ isHighlighted?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? '#8a2be2' : theme.colors.text
  };
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
  }
`

const ClaimButton = styled(Button)<{ hasRewards: boolean }>`
  background: ${({ hasRewards }) =>
    hasRewards
      ? 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)'
      : 'rgba(138, 43, 226, 0.3)'
  };
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  min-width: 160px;
  height: 48px;
  color: white;
  cursor: ${({ hasRewards }) => hasRewards ? 'pointer' : 'not-allowed'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ hasRewards }) => hasRewards && css`
    animation: ${glow} 2s infinite;
    
    &:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, #9932cc 0%, #5d1a8b 100%);
      box-shadow: 0 8px 32px rgba(138, 43, 226, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
    padding: 16px 32px;
    min-width: 180px;
    height: 56px;
    border-radius: 16px;
  }
`

const EmptyState = styled(Box)`
  text-align: center;
  padding: 32px 16px;
  background: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(0, 0, 0, 0.02)'
  };
  border-radius: 12px;
  border: 2px dashed ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 48px 24px;
    border-radius: 16px;
  }
`

const EmptyStateIcon = styled(Text)`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 64px;
  }
`

const EmptyStateText = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 8px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
  }
`

const EmptyStateSubtext = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  opacity: 0.7;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

interface UserPortfolioCardProps {
  totalStaked: number
  pendingRewards: number
  activeStakes: number
}

const UserPortfolioCard: React.FC<UserPortfolioCardProps> = ({
  totalStaked,
  pendingRewards,
  activeStakes,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const hasStakes = totalStaked > 0 || pendingRewards > 0

  const formatCurrency = (amount: number) => {
    return `$${formatNumber(amount, 2, 2)}`
  }

  const formatToken = (amount: number) => {
    return `${formatNumber(amount, 2, 2)} COMET`
  }

  const handleClaimRewards = () => {
    // TODO: Implement claim rewards functionality
    // console.log('Claiming rewards:', pendingRewards)
  }

  if (!hasStakes) {
    return (
      <Container>
        <Title>{t('Your Portfolio')}</Title>
        <EmptyState>
          <EmptyStateIcon>🚀</EmptyStateIcon>
          <EmptyStateText>{t('Start Your COMET Journey')}</EmptyStateText>
          <EmptyStateSubtext>
            {t('Stake COMET tokens in our rolling cycles to earn rewards')}
          </EmptyStateSubtext>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Title>{t('Your Portfolio')}</Title>
      
      <StatsRow>
        <StatGroup>
          <StatItem>
            <StatLabel>{t('Total Staked')}</StatLabel>
            <StatValue>{formatToken(totalStaked)}</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>{t('Pending Rewards')}</StatLabel>
            <StatValue isHighlighted={pendingRewards > 0}>
              {formatCurrency(pendingRewards)}
            </StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>{t('Active Stakes')}</StatLabel>
            <StatValue>{activeStakes}</StatValue>
          </StatItem>
        </StatGroup>
        
        <ClaimButton
          hasRewards={pendingRewards > 0}
          onClick={handleClaimRewards}
          disabled={pendingRewards <= 0}
        >
          {pendingRewards > 0 
            ? t('Claim All Rewards')
            : t('No Rewards Yet')
          }
        </ClaimButton>
      </StatsRow>
    </Container>
  )
}

export default UserPortfolioCard












