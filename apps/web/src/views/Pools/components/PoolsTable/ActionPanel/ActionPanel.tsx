import {
  BalanceWithLoading,
  Box,
  Flex,
  HelpIcon,
  Message,
  MessageText,
  Text,
  useMatchBreakpoints,
} from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'
import { useMemo } from 'react'
import { css, keyframes, styled } from 'styled-components'
// Migration hook removed

import { useTranslation } from '@cometswap/localization'
import { Token } from '@cometswap/sdk'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCometVault, DeserializedLockedVaultUser, VaultKey } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/cometPool'
// CometStaking components removed - migration logic deleted
import { CometBunny, LearnMoreLink } from 'views/CometStaking/components/SyrupPool'
import WithdrawAllButton from '../../LockedPool/Buttons/WithdrawAllButton'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import PoolStatsInfo from '../../PoolStatsInfo'
import PoolTypeTag from '../../PoolTypeTag'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import AutoHarvest from './AutoHarvest'
import Harvest from './Harvest'
import Stake from './Stake'

// Temporary placeholder for CometCardTableView
const CometCardTableView = () => <div>CometCard Table View</div>

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

export const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px;
  }
`

export const ActionContainer = styled(Box)<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) => (isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'center')};
  }
`

interface ActionPanelProps {
  account: string
  pool: Pool.DeserializedPool<Token>
  expanded: boolean
}

export const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
    margin-right: 16px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const YieldBoostDurationRow = ({ lockEndTime, lockStartTime }) => {
  const { weekDuration, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  return (
    <>
      <YieldBoostRow secondDuration={secondDuration} />
      <LockDurationRow weekDuration={weekDuration} />
    </>
  )
}

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({ account, pool, expanded }) => {
  const { t } = useTranslation()
  const { userData, vaultKey } = pool
  const { isMobile } = useMatchBreakpoints()

  const vaultData = useVaultPoolByKey(vaultKey as Pool.VaultKey) as DeserializedLockedCometVault
  const cometAsBigNumber = vaultData.userData?.balance?.cometAsBigNumber ?? new BigNumber(0)
  const vaultPosition = getVaultPosition(vaultData.userData)

  const isLocked = vaultData.userData?.locked

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = vaultKey
    ? cometAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const originalLockedAmount = getBalanceNumber(vaultData.userData?.lockedAmount)

  const isCometPool = useMemo(
    () => pool.vaultKey === VaultKey.CometVault,
    [pool.vaultKey],
  )
  // Migration and delegation checks removed

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && vaultKey === VaultKey.CometVault && isLocked && (
          <Box mb="16px">
            <YieldBoostDurationRow
              lockEndTime={vaultData.userData?.lockEndTime}
              lockStartTime={vaultData.userData?.lockStartTime}
            />
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Original locked amount')}
              </Text>
              <BalanceWithLoading color="text" bold fontSize="16px" value={originalLockedAmount} decimals={2} />
            </Flex>
          </Box>
        )}
        <Flex flexDirection="column" mb="8px">
          <>
            {!isMobile && vaultKey === VaultKey.CometVault && !account ? (
              <CometBunny />
            ) : (
              <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
            )}
          </>
        </Flex>
        <Flex alignItems="center">
          {vaultKey !== VaultKey.CometVault && (
            <PoolTypeTag vaultKey={vaultKey} isLocked={isLocked} account={account}>
              {(tagTargetRef: any) => (
                <Flex ref={tagTargetRef}>
                  <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                </Flex>
              )}
            </PoolTypeTag>
          )}
        </Flex>
      </InfoSection>
      <ActionContainer>
        <Box width="100%">
          {pool.vaultKey === VaultKey.CometVault && (
            <VaultPositionTagWithLabel
              userData={vaultData.userData as DeserializedLockedVaultUser}
              width={['auto', null, 'fit-content']}
              ml={['12px', null, null, null, null, '32px']}
            />
          )}
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            {pool.vaultKey ? (
              <>
                {account && vaultPosition !== VaultPosition.None ? (
                  isUserDelegated ? null : (
                    <AutoHarvest pool={pool} />
                  )
                ) : (
                  <CometCardTableView />
                )}
              </>
            ) : (
              <Harvest {...pool} />
            )}
            <Stake pool={pool} />
          </ActionContainer>
        </Box>
        {isCometPool && account && vaultPosition !== VaultPosition.None && (
          <Flex width="100%">
            <Message
              variant="warning"
              style={{ width: '100%', margin: '16px', marginBottom: '0', flexWrap: 'wrap' }}
              action={
                <Flex
                  alignItems="center"
                  style={{ gap: isMobile ? 15 : 24, flexDirection: isMobile ? 'column' : 'row' }}
                >
                  {/* Migration and delegation cards removed - simplified staking only */}
                  {vaultPosition >= VaultPosition.LockedEnd && <WithdrawAllButton />}
                </Flex>
              }
              showIcon={vaultPosition !== VaultPosition.Locked}
            >
              {vaultPosition !== VaultPosition.Locked && (
                <MessageText marginBottom="10px">
                  {vaultPosition === VaultPosition.Flexible ? (
                    <>
                      {t('Flexible COMETpool is discontinued and no longer distributing rewards.')}
                      <LearnMoreLink withArrow />
                    </>
                  ) : vaultPosition >= VaultPosition.LockedEnd ? (
                    isUserDelegated ? (
                      t('To check out your converted position, please visit the protocol page.')
                    ) : isMigratedToComet ? (
                      t(
                        'Extending or adding COMETis not available for migrated positions. To get more veCOMET, withdraw from the unlocked COMETpool position, and add COMETto veCOMET.',
                      )
                    ) : (
                      t(
                        'The lock period has ended. To get more veCOMET, withdraw from the unlocked COMETpool position, and add COMETto veCOMET.',
                      )
                    )
                  ) : null}
                </MessageText>
              )}
            </Message>
          </Flex>
        )}
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel

