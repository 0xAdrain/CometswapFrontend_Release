import { useState, useCallback, useMemo } from 'react'
import { Box, Flex, Text, Button, Input, useMatchBreakpoints } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { Currency } from '@cometswap/sdk'
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

const StatsContainer = styled(Flex)`
  gap: 16px;
  margin-bottom: 32px;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 24px;
  }
`

const StatCard = styled(Box)<{ isHighlighted?: boolean }>`
  flex: 1;
  padding: 20px;
  background: ${({ theme, isHighlighted }) => 
    isHighlighted
      ? theme.isDark
        ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(75, 0, 130, 0.05) 100%)'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)'
  };
  border-radius: 16px;
  border: 1px solid ${({ theme, isHighlighted }) =>
    isHighlighted
      ? 'rgba(138, 43, 226, 0.3)'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'
  };
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) =>
      theme.isDark
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)'
    };
  }
`

const StatLabel = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 8px;
  font-weight: 500;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const StatValue = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`

const StakingSection = styled(Box)`
  background: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(0, 0, 0, 0.02)'
  };
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
`

const StakingTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const InputContainer = styled(Box)`
  position: relative;
  margin-bottom: 16px;
`

const StyledInput = styled(Input)`
  background: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.02)'
  };
  border: 2px solid ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 80px 16px 20px;
  height: 56px;
  
  &:focus {
    border-color: #8a2be2;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    padding: 20px 100px 20px 24px;
    height: 64px;
  }
`

const MaxButton = styled(Button)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%);
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  height: 32px;
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #9932cc 0%, #5d1a8b 100%);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
    padding: 8px 16px;
    height: 40px;
    right: 16px;
  }
`

const QuickAmountButtons = styled(Flex)`
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const QuickAmountButton = styled(Button)<{ isSelected?: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)'
      : 'transparent'
  };
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected
      ? '#8a2be2'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'
  };
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  height: 36px;
  color: ${({ isSelected, theme }) =>
    isSelected ? 'white' : theme.colors.text
  };
  flex: 1;
  min-width: 80px;
  
  &:hover {
    border-color: #8a2be2;
    background: ${({ isSelected }) =>
      isSelected
        ? 'linear-gradient(135deg, #9932cc 0%, #5d1a8b 100%)'
        : 'rgba(138, 43, 226, 0.1)'
    };
  }
`

const ActionButtons = styled(Flex)`
  gap: 12px;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const StakeButton = styled(Button)<{ isValid: boolean }>`
  background: ${({ isValid }) =>
    isValid
      ? 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)'
      : 'rgba(138, 43, 226, 0.3)'
  };
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 24px;
  height: 56px;
  color: white;
  flex: 1;
  cursor: ${({ isValid }) => isValid ? 'pointer' : 'not-allowed'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ isValid }) => isValid && css`
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
`

const UnstakeButton = styled(Button)`
  background: transparent;
  border: 2px solid ${({ theme }) => 
    theme.isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)'
  };
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 24px;
  height: 56px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.textSubtle};
    background: ${({ theme }) => 
      theme.isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.02)'
    };
  }
`

interface UnifiedStakingCardProps {
  totalStaked: number
  userStaked: number
  userBalance: number
  token?: Currency
}

const UnifiedStakingCard: React.FC<UnifiedStakingCardProps> = ({
  totalStaked,
  userStaked,
  userBalance,
  token,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [stakeAmount, setStakeAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickAmounts = [
    { label: '25%', value: userBalance * 0.25 },
    { label: '50%', value: userBalance * 0.5 },
    { label: '75%', value: userBalance * 0.75 },
    { label: 'MAX', value: userBalance },
  ]

  const numericAmount = useMemo(() => {
    const num = parseFloat(stakeAmount)
    return Number.isNaN(num) ? 0 : num
  }, [stakeAmount])

  const isValidAmount = useMemo(() => {
    return numericAmount > 0 && numericAmount <= userBalance
  }, [numericAmount, userBalance])

  const handleAmountChange = useCallback((value: string) => {
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value)
    }
  }, [])

  const handleQuickAmount = useCallback((amount: number) => {
    setStakeAmount(amount.toString())
  }, [])

  const handleMaxClick = useCallback(() => {
    setStakeAmount(userBalance.toString())
  }, [userBalance])

  const handleStake = useCallback(async () => {
    if (!isValidAmount) return
    
    setIsLoading(true)
    try {
      // TODO: Implement actual staking logic
      // console.log('Staking:', numericAmount, 'COMET')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStakeAmount('')
    } catch (error) {
      console.error('Staking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isValidAmount, numericAmount])

  const handleUnstake = useCallback(async () => {
    if (userStaked <= 0) return
    
    setIsLoading(true)
    try {
      // TODO: Implement actual unstaking logic
      // console.log('Unstaking all COMET')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Unstaking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userStaked])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M COMET`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K COMET`
    }
    return `${formatNumber(amount, 2, 2)} COMET`
  }

  return (
    <Container>
      <Title>{t('COMET Staking Pool')}</Title>
      
      {/* Stats */}
      <StatsContainer>
        <StatCard>
          <StatLabel>{t('Total Staked')}</StatLabel>
          <StatValue>{formatCurrency(totalStaked)}</StatValue>
        </StatCard>
        
        <StatCard isHighlighted={userStaked > 0}>
          <StatLabel>{t('Your Staked')}</StatLabel>
          <StatValue>{formatCurrency(userStaked)}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatLabel>{t('Your Balance')}</StatLabel>
          <StatValue>{formatCurrency(userBalance)}</StatValue>
        </StatCard>
      </StatsContainer>

      {/* Staking Interface */}
      <StakingSection>
        <StakingTitle>{t('Stake COMET')}</StakingTitle>
        
        <InputContainer>
          <StyledInput
            type="text"
            placeholder="0.00"
            value={stakeAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <MaxButton onClick={handleMaxClick}>
            {t('MAX')}
          </MaxButton>
        </InputContainer>
        
        <QuickAmountButtons>
          {quickAmounts.map((quick, index) => (
            <QuickAmountButton
              key={`quick-${quick.label}-${quick.value}`}
              isSelected={numericAmount === quick.value}
              onClick={() => handleQuickAmount(quick.value)}
            >
              {quick.label}
            </QuickAmountButton>
          ))}
        </QuickAmountButtons>

        <ActionButtons>
          <UnstakeButton
            onClick={handleUnstake}
            disabled={userStaked <= 0 || isLoading}
          >
            {t('Unstake All')}
          </UnstakeButton>
          <StakeButton
            isValid={isValidAmount}
            onClick={handleStake}
            disabled={!isValidAmount || isLoading}
          >
            {isLoading 
              ? t('Processing...') 
              : t('Stake %amount% COMET', { amount: formatNumber(numericAmount, 2, 2) })
            }
          </StakeButton>
        </ActionButtons>
      </StakingSection>
    </Container>
  )
}

export default UnifiedStakingCard





