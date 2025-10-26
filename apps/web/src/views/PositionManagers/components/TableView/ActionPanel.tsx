import { Strategy } from '@cometswap/position-managers'
import { Flex, useMatchBreakpoints } from '@cometswap/uikit'

import { useTheme } from 'styled-components'
import { LiquidityManagementProps } from '../LiquidityManagement'
import { ManagerInfo } from '../ManagerInfo'
import { VaultInfo, VaultInfoProps } from '../VaultInfo'
import { VaultLinks, VaultLinksProps } from '../VaultLinks'
import { LiquidityManagement } from './LiquidityManagement'
import { TableActionCard } from './TableActionCard'

export const ActionPanel: React.FC<
  VaultInfoProps & VaultLinksProps & { strategy: Strategy } & LiquidityManagementProps
> = ({
  currencyA,
  currencyB,
  managerFee,
  token0PriceUSD,
  token1PriceUSD,
  poolToken0Amount,
  poolToken1Amount,
  allowDepositToken0,
  allowDepositToken1,
  isSingleDepositToken,
  tokenPerSecond,
  earningToken,
  isInCometRewardDateRange,
  manager,
  managerAddress,
  managerInfoUrl,
  strategyInfoUrl,
  projectVaultUrl,
  strategy,
  boosterMultiplier,
  id,
  totalAssetsInUsd,
  vaultName,
  feeTier,
  ratio,
  contractAddress,
  staked0Amount,
  staked1Amount,
  pendingReward,
  rewardPerSecond,
  aprDataInfo,
  rewardEndTime,
  refetch,
  rewardStartTime,
  totalSupplyAmounts,
  userLpAmounts,
  precision,
  totalStakedInUsd,
  learnMoreAboutUrl,
  lpTokenDecimals,
  aprTimeWindow,
  bCometWrapper,
  minDepositUSD,
  isBooster,
  boosterContractAddress,
  adapterAddress,
}) => {
  const { colors } = useTheme()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <Flex
      background={colors.dropdown}
      p="24px 32px"
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      style={{ gap: 32 }}
    >
      <Flex flexDirection="column" width={isMobile ? '100%' : 304}>
        {!isMobile && (
          <VaultInfo
            currencyA={currencyA}
            currencyB={currencyB}
            managerFee={managerFee}
            token0PriceUSD={token0PriceUSD}
            token1PriceUSD={token1PriceUSD}
            poolToken0Amount={poolToken0Amount}
            poolToken1Amount={poolToken1Amount}
            allowDepositToken0={allowDepositToken0}
            allowDepositToken1={allowDepositToken1}
            isSingleDepositToken={isSingleDepositToken}
            tokenPerSecond={tokenPerSecond}
            earningToken={earningToken}
            isTableView={!isDesktop}
            isInCometRewardDateRange={isInCometRewardDateRange}
          />
        )}
        <VaultLinks
          mt="0.5em"
          manager={manager}
          vaultAddress={bCometWrapper ?? contractAddress}
          managerAddress={managerAddress}
          managerInfoUrl={managerInfoUrl}
          strategyInfoUrl={strategyInfoUrl}
          projectVaultUrl={projectVaultUrl}
        />
      </Flex>
      <Flex flexDirection="column" flexGrow={1} style={{ gap: 16 }} width={isMobile ? '100%' : undefined}>
        <TableActionCard>
          <ManagerInfo
            id={manager.id}
            name={manager.name}
            strategy={strategy}
            allowTokenName={`${allowDepositToken0 ? currencyA.symbol : ''}${
              allowDepositToken1 ? currencyB.symbol : ''
            }`}
          />
        </TableActionCard>
        <TableActionCard style={{ padding: 0 }}>
          <LiquidityManagement
            boosterMultiplier={boosterMultiplier}
            manager={manager}
            currencyA={currencyA}
            currencyB={currencyB}
            id={id}
            totalAssetsInUsd={totalAssetsInUsd}
            earningToken={earningToken}
            vaultName={vaultName}
            feeTier={feeTier}
            ratio={ratio}
            isSingleDepositToken={isSingleDepositToken}
            allowDepositToken0={allowDepositToken0}
            allowDepositToken1={allowDepositToken1}
            contractAddress={contractAddress}
            staked0Amount={staked0Amount}
            staked1Amount={staked1Amount}
            token0PriceUSD={token0PriceUSD}
            token1PriceUSD={token1PriceUSD}
            pendingReward={pendingReward}
            poolToken0Amount={poolToken0Amount}
            poolToken1Amount={poolToken1Amount}
            rewardPerSecond={rewardPerSecond}
            aprDataInfo={aprDataInfo}
            rewardEndTime={rewardEndTime}
            refetch={refetch}
            rewardStartTime={rewardStartTime}
            totalSupplyAmounts={totalSupplyAmounts}
            userLpAmounts={userLpAmounts}
            precision={precision}
            isInCometRewardDateRange={isInCometRewardDateRange}
            totalStakedInUsd={totalStakedInUsd}
            strategyInfoUrl={strategyInfoUrl}
            learnMoreAboutUrl={learnMoreAboutUrl}
            lpTokenDecimals={lpTokenDecimals}
            aprTimeWindow={aprTimeWindow}
            bCometWrapper={bCometWrapper}
            minDepositUSD={minDepositUSD}
            isBooster={isBooster && isInCometRewardDateRange}
            boosterContractAddress={boosterContractAddress}
            adapterAddress={adapterAddress}
          />
        </TableActionCard>
      </Flex>
      {isMobile && (
        <VaultInfo
          currencyA={currencyA}
          currencyB={currencyB}
          managerFee={managerFee}
          token0PriceUSD={token0PriceUSD}
          token1PriceUSD={token1PriceUSD}
          poolToken0Amount={poolToken0Amount}
          poolToken1Amount={poolToken1Amount}
          allowDepositToken0={allowDepositToken0}
          allowDepositToken1={allowDepositToken1}
          isSingleDepositToken={isSingleDepositToken}
          tokenPerSecond={tokenPerSecond}
          earningToken={earningToken}
          isTableView
          isInCometRewardDateRange={isInCometRewardDateRange}
        />
      )}
    </Flex>
  )
}

