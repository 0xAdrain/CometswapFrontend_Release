import { useState, useCallback, useMemo } from 'react'
import { 
  Modal, 
  ModalV2, 
  Box, 
  Flex, 
  Text, 
  Button, 
  Input, 
  Slider,
  useMatchBreakpoints 
} from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { Currency } from '@cometswap/sdk'
import styled, { keyframes, css } from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
  }
`

const ModalContent = styled(Box)`
  padding: 24px;
  max-width: 480px;
  width: 100%;
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 32px;
  }
`

const Header = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
`

const Title = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 28px;
  }
`

const Subtitle = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 500;
`

const CycleInfoCard = styled(Box)`
  background: ${({ theme }) => 
    theme.isDark 
      ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(75, 0, 130, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(138, 43, 226, 0.05) 0%, rgba(75, 0, 130, 0.02) 100%)'
  };
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`

const InfoGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`

const InfoItem = styled(Box)`
  text-align: center;
`

const InfoLabel = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
  }
`

const InputSection = styled(Box)`
  margin-bottom: 24px;
`

const InputLabel = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
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
  padding: 16px 20px;
  height: 56px;
  
  &:focus {
    border-color: #8a2be2;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    padding: 20px 24px;
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
`

const InputContainer = styled(Box)`
  position: relative;
`

const QuickAmountButtons = styled(Flex)`
  gap: 8px;
  margin-top: 12px;
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

const EstimateCard = styled(Box)`
  background: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(34, 197, 94, 0.1)' 
      : 'rgba(34, 197, 94, 0.05)'
  };
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
`

const EstimateLabel = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 8px;
  font-weight: 500;
`

const EstimateValue = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 4px;
`

const EstimateSubtext = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  opacity: 0.8;
`

const ActionButtons = styled(Flex)`
  gap: 12px;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const CancelButton = styled(Button)`
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

interface StakeModalProps {
  cycle: StakingCycle
  token?: Currency
  onClose: () => void
}

const StakeModal: React.FC<StakeModalProps> = ({
  cycle,
  token,
  onClose,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [stakeAmount, setStakeAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock user balance - in real app this would come from wallet
  const userBalance = 10000

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
    return numericAmount >= cycle.minStake && numericAmount <= userBalance
  }, [numericAmount, cycle.minStake, userBalance])

  const estimatedReward = useMemo(() => {
    if (numericAmount === 0) return 0
    // Simple estimation: (amount * APY / 100) * (duration / 365)
    return (numericAmount * cycle.apy / 100) * (cycle.duration / 365)
  }, [numericAmount, cycle.apy, cycle.duration])

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
      // console.log('Staking:', numericAmount, 'COMET in cycle:', cycle.id)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onClose()
    } catch (error) {
      console.error('Staking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isValidAmount, numericAmount, cycle.id, onClose])

  const formatCurrency = (amount: number) => {
    return `$${formatNumber(amount, 2, 2)}`
  }

  const formatToken = (amount: number) => {
    return `${formatNumber(amount, 0, 0)} COMET`
  }

  return (
    <ModalV2 isOpen onDismiss={onClose} closeOnOverlayClick>
      <ModalContent>
        <Header>
          <Title>{t('Stake in %cycleName%', { cycleName: cycle.name })}</Title>
          <Subtitle>{t('Lock your COMET tokens to earn rewards')}</Subtitle>
        </Header>

        <CycleInfoCard>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>{t('APY')}</InfoLabel>
              <InfoValue>{cycle.apy}%</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t('Duration')}</InfoLabel>
              <InfoValue>{cycle.duration} {t('Days')}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t('Min Stake')}</InfoLabel>
              <InfoValue>{formatToken(cycle.minStake)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t('Your Balance')}</InfoLabel>
              <InfoValue>{formatToken(userBalance)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </CycleInfoCard>

        <InputSection>
          <InputLabel>{t('Stake Amount')}</InputLabel>
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
        </InputSection>

        {numericAmount > 0 && (
          <EstimateCard>
            <EstimateLabel>{t('Estimated Reward')}</EstimateLabel>
            <EstimateValue>{formatCurrency(estimatedReward)}</EstimateValue>
            <EstimateSubtext>
              {t('Based on %apy% APY over %duration% days', {
                apy: cycle.apy,
                duration: cycle.duration,
              })}
            </EstimateSubtext>
          </EstimateCard>
        )}

        <ActionButtons>
          <CancelButton onClick={onClose}>
            {t('Cancel')}
          </CancelButton>
          <StakeButton
            isValid={isValidAmount}
            onClick={handleStake}
            disabled={!isValidAmount || isLoading}
          >
            {isLoading 
              ? t('Staking...') 
              : t('Stake %amount% COMET', { amount: formatNumber(numericAmount, 2, 2) })
            }
          </StakeButton>
        </ActionButtons>
      </ModalContent>
    </ModalV2>
  )
}

export default StakeModal














