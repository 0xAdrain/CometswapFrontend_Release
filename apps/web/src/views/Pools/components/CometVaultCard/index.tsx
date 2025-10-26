import { Box, Button, CardBody, CardProps, Flex, FlexGap, Skeleton, TokenPairImage, useModal } from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'

import { useTranslation } from '@cometswap/localization'
import { Token } from '@cometswap/sdk'
import { vaultPoolConfig } from 'config/constants/pools'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedCometVault, DeserializedLockedCometVault, VaultKey } from 'state/types'
import { styled } from 'styled-components'
import { VaultPosition, getVaultPosition } from 'utils/cometPool'
import BenefitsModal from 'views/Pools/components/RevenueSharing/BenefitsModal'
import useVComet from 'views/Pools/hooks/useVComet'
import { useAccount } from 'wagmi'

import { CometCard } from 'views/CometStaking/components/SyrupPool'
// Removed migration and delegation related imports
import LockedStakingApy from '../LockedPool/LockedStakingApy'
import CardFooter from '../PoolCard/CardFooter'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import VaultCardActions from './VaultCardActions'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CometVaultProps extends CardProps {
  pool?: Pool.DeserializedPool<Token>
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
  showIComet?: boolean
  showSkeleton?: boolean
}

interface CometVaultDetailProps {
  isLoading?: boolean
  account?: string
  pool: Pool.DeserializedPool<Token>
  vaultPool: DeserializedCometVault
  accountHasSharesStaked?: boolean
  defaultFooterExpanded?: boolean
  showIComet?: boolean
  performanceFeeAsDecimal?: number
}

export const CometVaultDetail: React.FC<React.PropsWithChildren<CometVaultDetailProps>> = ({
  isLoading = false,
  account,
  pool,
  vaultPool,
  accountHasSharesStaked,
  showIComet,
  performanceFeeAsDecimal,
  defaultFooterExpanded,
}) => {
  const { t } = useTranslation()
  const { isInitialization } = useVComet()
  const [onPresentViewBenefitsModal] = useModal(
    <BenefitsModal pool={pool} userData={(vaultPool as DeserializedLockedCometVault)?.userData} />,
    true,
    false,
    'revenueModal',
  )

  const vaultPosition = getVaultPosition(vaultPool.userData)
  const isLocked = (vaultPool as DeserializedLockedCometVault)?.userData?.locked
  // Delegation logic removed - simplified staking only
  const isUserDelegated = false

  if (!pool) {
    return null
  }

  return (
    <>
      <StyledCardBody isLoading={isLoading}>
        {/* Update card removed - simplified staking interface */}

        {account && pool.vaultKey === VaultKey.CometVault && (
          <VaultPositionTagWithLabel userData={(vaultPool as DeserializedLockedCometVault)?.userData} />
        )}
        {account && pool.vaultKey === VaultKey.CometVault && isLocked ? (
          <>
            <LockedStakingApy
              userData={(vaultPool as DeserializedLockedCometVault).userData}
              showIComet={showIComet}
              pool={pool}
              account={account}
            />
            {vaultPosition === VaultPosition.Locked && isInitialization && !showIComet && (
              <Button mt="16px" width="100%" variant="secondary" onClick={onPresentViewBenefitsModal}>
                {t('View Benefits')}
              </Button>
            )}
          </>
        ) : (
          <>
            <CometCard />
            {/* {<StakingApy pool={pool} />} */}
            {vaultPosition !== VaultPosition.None && !isUserDelegated && (
              <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
                <Box>
                  {account && (
                    <Box mb="8px">
                      <UnstakingFeeCountdownRow vaultKey={pool.vaultKey ?? VaultKey.CometVault} />
                    </Box>
                  )}
                  {/* <RecentCometProfitRow pool={pool} /> */}
                </Box>
                <Flex flexDirection="column">
                  {account && (
                    <VaultCardActions
                      pool={pool}
                      accountHasSharesStaked={accountHasSharesStaked}
                      isLoading={isLoading}
                      performanceFee={performanceFeeAsDecimal}
                    />
                  )}
                </Flex>
              </FlexGap>
            )}
          </>
        )}
      </StyledCardBody>
      {account && !isUserDelegated && (
        <CardFooter isLocked={isLocked} defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
      )}
    </>
  )
}

const CometVaultCard: React.FC<React.PropsWithChildren<CometVaultProps>> = ({
  pool,
  showStakedOnly,
  defaultFooterExpanded,
  showIComet = false,
  showSkeleton = true,
  ...props
}) => {
  const { address: account } = useAccount()

  const vaultPool = useVaultPoolByKey(pool?.vaultKey || VaultKey.CometVault)
  const totalStaked = pool?.totalStaked

  const userShares = vaultPool?.userData?.userShares
  const isVaultUserDataLoading = vaultPool?.userData?.isLoading
  const performanceFeeAsDecimal = vaultPool?.fees?.performanceFeeAsDecimal

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool?.userData || isVaultUserDataLoading

  if (!pool || (showStakedOnly && !accountHasSharesStaked)) {
    return null
  }

  return (
    <Pool.StyledCard isActive {...props}>
      <Pool.PoolCardHeader isStaking={accountHasSharesStaked}>
        {!showSkeleton || (totalStaked && totalStaked.gte(0)) ? (
          <>
            <Pool.PoolCardHeaderTitle
              title={vaultPoolConfig?.[pool.vaultKey ?? '']?.name ?? ''}
              subTitle={vaultPoolConfig?.[pool.vaultKey ?? ''].description ?? ''}
            />
            <TokenPairImage {...vaultPoolConfig?.[pool.vaultKey ?? ''].tokenImage} width={64} height={64} />
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </Pool.PoolCardHeader>
      <CometVaultDetail
        isLoading={isLoading}
        account={account}
        pool={pool}
        vaultPool={vaultPool}
        accountHasSharesStaked={accountHasSharesStaked}
        showIComet={showIComet}
        performanceFeeAsDecimal={performanceFeeAsDecimal}
        defaultFooterExpanded={defaultFooterExpanded}
      />
    </Pool.StyledCard>
  )
}

export default CometVaultCard

