import { Box, Flex, Text, useMatchBreakpoints } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import styled from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'

const Container = styled(Box)`
  padding: 16px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }
`

const Title = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    margin-bottom: 20px;
  }
`

const AllocationContainer = styled(Box)`
  position: relative;
  margin-bottom: 24px;
`

const AllocationBar = styled.div<{ percentage: number; minPercentage: number }>`
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: ${({ theme }) => 
    theme.isDark 
      ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  ${({ theme }) => theme.mediaQueries.md} {
    height: 56px;
    border-radius: 6px;
  }
`

const StakingSection = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  position: relative;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    inset 0 2px 0 rgba(255, 255, 255, 0.25),
    inset 0 -2px 0 rgba(0, 0, 0, 0.25),
    2px 0 4px rgba(16, 185, 129, 0.3);
  
  /* 右边缘的"侵略"效果 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -2px;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 2px 0 6px rgba(16, 185, 129, 0.4);
  }
`

const TreasurySection = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => 100 - percentage}%;
  height: 100%;
  background: ${({ theme }) => 
    theme.isDark 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.25) 100%)' 
      : 'linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%)'
  };
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  border-left: 1px solid ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
`

const MinimumMarker = styled.div<{ minPercentage: number }>`
  position: absolute;
  top: -8px;
  left: ${({ minPercentage }) => minPercentage}%;
  transform: translateX(-50%);
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: calc(100% + 16px);
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
    border-radius: 1.5px;
    box-shadow: 
      0 0 0 1px rgba(255, 255, 255, 0.4),
      0 3px 6px rgba(220, 38, 38, 0.5),
      0 0 12px rgba(220, 38, 38, 0.3);
  }
  
  /* 左边分界�?*/
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -8px;
    width: 16px;
    height: calc(100% + 16px);
    border-left: 2px solid rgba(220, 38, 38, 0.6);
    border-right: 2px solid rgba(220, 38, 38, 0.6);
    border-radius: 1px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    top: -10px;
    
    &::before {
      width: 4px;
      height: calc(100% + 20px);
      border-radius: 2px;
    }
    
    &::after {
      left: -10px;
      width: 20px;
      height: calc(100% + 20px);
      border-left-width: 2px;
      border-right-width: 2px;
    }
  }
`

const MinimumLabel = styled.div<{ minPercentage: number }>`
  position: absolute;
  bottom: -24px;
  left: ${({ minPercentage }) => minPercentage}%;
  transform: translateX(-50%);
  z-index: 3;
  
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #dc2626;
  background: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(0, 0, 0, 0.9)' 
      : 'rgba(255, 255, 255, 0.95)'
  };
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #dc2626;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(220, 38, 38, 0.3);
  backdrop-filter: blur(10px);

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 11px;
    bottom: -20px;
    padding: 5px 10px;
    border-radius: 5px;
    letter-spacing: 0.8px;
  }
`



const BarLabels = styled(Flex)`
  justify-content: space-between;
  margin-top: 8px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 12px;
  }
`

const BarLabel = styled(Text)<{ isLeft?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ isLeft, theme }) => 
    isLeft 
      ? '#10b981' 
      : theme.colors.textSubtle
  };
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`


const AllocationText = styled(Text)`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-top: 16px;
  font-weight: 500;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

interface ProtocolRevenueCardProps {
  totalRevenue: number
  stakingRewards: number
  protocolTreasury: number
  stakingPercentage: number
}

const ProtocolRevenueCard: React.FC<ProtocolRevenueCardProps> = ({
  totalRevenue,
  stakingRewards,
  protocolTreasury,
  stakingPercentage,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // 最低保证给质押者的比例（硬编码在合约中�?  const minimumStakingPercentage = 50

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${formatNumber(amount, 0, 0)}`
  }

  return (
    <Container>
      <Title>{t('Protocol Revenue Distribution')}</Title>
      
      <AllocationContainer>
        <AllocationBar 
          percentage={stakingPercentage} 
          minPercentage={minimumStakingPercentage}
        >
          <StakingSection percentage={stakingPercentage} />
          <TreasurySection percentage={stakingPercentage} />
        </AllocationBar>
        
        <MinimumMarker minPercentage={minimumStakingPercentage} />
        <MinimumLabel minPercentage={minimumStakingPercentage}>
          MINIMUM
        </MinimumLabel>
        
        <BarLabels>
          <BarLabel isLeft>{t('Staking Rewards')} ({stakingPercentage}%)</BarLabel>
          <BarLabel>{t('Protocol Treasury')} ({100 - stakingPercentage}%)</BarLabel>
        </BarLabels>
      </AllocationContainer>

      <AllocationText>
        {t('Current Allocation: %stakingPercentage% to Stakers | %treasuryPercentage% to Protocol Treasury', {
          stakingPercentage,
          treasuryPercentage: 100 - stakingPercentage,
        })}
      </AllocationText>
    </Container>
  )
}

export default ProtocolRevenueCard

