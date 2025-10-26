import React from 'react'
import { Box, Text, Button, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import styled, { keyframes } from 'styled-components'
import { formatNumber } from '@cometswap/utils/formatBalance'
import PayoutCycleCard from './PayoutCycleCard'
import ProtocolRevenueCard from './ProtocolRevenueCard'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled(Box)`
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }
`

const AnimatedCard = styled(Box)<{ delay?: number }>`
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${({ delay }) => delay || 0}ms;
  animation-fill-mode: both;
`

const SummarySection = styled(Box)`
  background: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
    margin-bottom: 24px;
  }
`

const SummaryTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
    margin-bottom: 16px;
  }
`

const SummaryGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
`

const SummaryItem = styled(Box)`
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};
  border-radius: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px;
  }
`

const SummaryValue = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const SummaryLabel = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`

const ClaimButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

const CyclesTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    margin-bottom: 20px;
  }
`

const CyclesGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    gap: 20px;
  }
`

const LargeCycleContainer = styled(Box)`
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 20px;
  }
`

const NoStakesContainer = styled(Box)`
  text-align: center;
  padding: 40px 20px;
  background: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
`

const NoStakesText = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 16px;
`

const GoStakeButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 16px;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`

const HintText = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
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

interface ProtocolRevenue {
  totalRevenue: number
  stakingRewards: number
  protocolTreasury: number
  stakingPercentage: number
}

interface PayoutPoolsViewProps {
  cycles: PayoutCycle[]
  userStaked: number
  protocolRevenue: ProtocolRevenue
  onSwitchToStaking: () => void
}

const PayoutPoolsView: React.FC<PayoutPoolsViewProps> = ({
  cycles,
  userStaked,
  protocolRevenue,
  onSwitchToStaking,
}) => {
  const { t } = useTranslation()

  // 计算用户总奖励
  const totalUserRewards = cycles.reduce((sum, cycle) => {
    return sum + cycle.userEstimate
  }, 0)

  // 计算可领取奖励
  const claimableRewards = cycles
    .filter((cycle) => cycle.progress >= 100 && cycle.userEstimate > 0)
    .reduce((sum, cycle) => sum + cycle.userEstimate, 0)

  // 计算活跃周期数
  const activeCycles = cycles.filter((cycle) => cycle.progress < 100).length

  const hasStakes = userStaked > 0

  // 分离前4个周期和最大的周期
  const regularCycles = cycles.slice(0, 4)
  const largeCycle = cycles.length > 4 ? cycles[4] : null

  const handleClaimAll = () => {
    // console.log('Claiming all rewards:', claimableRewards)
    // TODO: 实现领取逻辑
  }

  if (!hasStakes) {
    return (
      <Container>
        <AnimatedCard delay={200}>
          <NoStakesContainer>
            <NoStakesText>{t('No Stakes Found')}</NoStakesText>
            <NoStakesText>{t('You need to stake COMET tokens to participate in payout pools.')}</NoStakesText>
            <GoStakeButton onClick={onSwitchToStaking}>{t('Go Stake')}</GoStakeButton>
            <HintText onClick={onSwitchToStaking}>{t("Don't see your rewards? Go stake")}</HintText>
          </NoStakesContainer>
        </AnimatedCard>
      </Container>
    )
  }

  return (
    <Container>
      {/* Your Rewards Summary - 移到最上面 */}
      <SummarySection>
        <SummaryTitle>{t('Your Rewards Summary')}</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <SummaryValue>{formatNumber(totalUserRewards, 0, 4)} COMET</SummaryValue>
            <SummaryLabel>{t('Total Rewards')}</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{formatNumber(claimableRewards, 0, 4)} COMET</SummaryValue>
            <SummaryLabel>{t('Claimable')}</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{activeCycles}</SummaryValue>
            <SummaryLabel>{t('Active Cycles')}</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
        <ClaimButton onClick={handleClaimAll} disabled={claimableRewards === 0}>
          {claimableRewards > 0
            ? t('Claim All Rewards (%amount% COMET)', { amount: formatNumber(claimableRewards, 0, 4) })
            : t('No Rewards Available')}
        </ClaimButton>
        {claimableRewards === 0 && (
          <HintText onClick={onSwitchToStaking}>{t("Don't see your rewards? Go stake")}</HintText>
        )}
      </SummarySection>

      {/* Protocol Revenue Distribution */}
      <Box mb="20px">
        <ProtocolRevenueCard
          totalRevenue={protocolRevenue.totalRevenue}
          stakingRewards={protocolRevenue.stakingRewards}
          protocolTreasury={protocolRevenue.protocolTreasury}
          stakingPercentage={protocolRevenue.stakingPercentage}
        />
      </Box>

      <CyclesTitle>{t('Payout Cycles')}</CyclesTitle>

      {/* 2x2 网格显示前4个周期 */}
      <CyclesGrid>
        {regularCycles.map((cycle, index) => (
          <AnimatedCard key={cycle.id} delay={300 + index * 100}>
            <PayoutCycleCard cycle={cycle} />
          </AnimatedCard>
        ))}
      </CyclesGrid>

      {/* 最大的周期单独显示 */}
      {largeCycle && (
        <LargeCycleContainer>
          <AnimatedCard delay={700}>
            <PayoutCycleCard cycle={largeCycle} />
          </AnimatedCard>
        </LargeCycleContainer>
      )}
    </Container>
  )
}

export default PayoutPoolsView
