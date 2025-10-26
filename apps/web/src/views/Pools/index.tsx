import { styled } from 'styled-components'

import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { checkIsBoostedPool } from '@cometswap/pools'
import { Token } from '@cometswap/sdk'
import { Flex, FlexLayout, Heading, Image, Link, Loading, PageHeader, Text, ViewMode } from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
import { TokenPairImage } from 'components/TokenImage'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import { useAccount } from 'wagmi'

import CometVaultCard from './components/CometVaultCard'
import AprRow from './components/PoolCard/AprRow'
import CardActions from './components/PoolCard/CardActions'
import CardFooter from './components/PoolCard/CardFooter'
import PoolControls from './components/PoolControls'
import PoolRow, { VaultPoolRow } from './components/PoolsTable/PoolRow'
import { CometFourYearCard } from './components/CometFourYearCard'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { pools, userDataLoaded } = usePoolsWithVault()

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Syrup Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
          <CometFourYearCard />
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch, showFinishedPools }) => (
            <>
              {showFinishedPools && chainId === ChainId.BSC && (
                <FinishedTextContainer>
                  <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                    {t('Looking for v1 COMETsyrup pools?')}
                  </Text>
                  <FinishedTextLink
                    href="https://v1-farms.cometswap.finance/pools/history"
                    fontSize={['16px', null, '20px']}
                    color="failure"
                  >
                    {t('Go to migration page')}.
                  </FinishedTextLink>
                </FinishedTextContainer>
              )}
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool) =>
                    pool.vaultKey ? (
                      <CometVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
                    ) : (
                      <Pool.PoolCard<Token>
                        key={pool.sousId}
                        pool={pool}
                        isBoostedPool={Boolean(chainId && checkIsBoostedPool(pool.contractAddress, chainId))}
                        isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                        cardContent={
                          account ? (
                            <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                          ) : (
                            <>
                              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                                {t('Start earning')}
                              </Text>
                              <ConnectWalletButton />
                            </>
                          )
                        }
                        tokenPairImage={
                          <TokenPairImage
                            primaryToken={pool.earningToken}
                            secondaryToken={pool.stakingToken}
                            width={64}
                            height={64}
                          />
                        }
                        cardFooter={<CardFooter pool={pool} account={account ?? ''} />}
                        aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                      />
                    ),
                  )}
                </CardLayout>
              ) : (
                <Pool.PoolsTable>
                  {chosenPools.map((pool) =>
                    pool.vaultKey ? (
                      <VaultPoolRow
                        initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                        key={pool.vaultKey}
                        vaultKey={pool.vaultKey}
                        account={account ?? ''}
                      />
                    ) : (
                      <PoolRow
                        initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                        key={pool.sousId}
                        sousId={pool.sousId}
                        account={account ?? ''}
                      />
                    ),
                  )}
                </Pool.PoolsTable>
              )}
              <Image
                mx="auto"
                mt="12px"
                src="/images/decorations/3d-syrup-bunnies.png"
                alt="Comet illustration"
                width={192}
                height={184.5}
              />
            </>
          )}
        </PoolControls>
      </Page>
    </>
  )
}

export default Pools

