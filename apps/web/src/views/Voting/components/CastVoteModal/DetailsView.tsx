import { useTranslation } from '@cometswap/localization'
import { Box, Flex, HelpIcon, Link, RocketIcon, ScanLink, Text, useTooltip } from '@cometswap/uikit'
import { formatNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { ModalInner, VotingBoxBorder, VotingBoxCardInner } from './styles'

export const StyledScanLink = styled(ScanLink)`
  display: inline-flex;
  font-size: 14px;
  > svg {
    width: 14px;
  }
`

const FixedTermWrapper = styled(Box)<{ expired?: boolean }>`
  width: 100%;
  margin: 16px 0;
  padding: 1px 1px 3px 1px;
  background: ${({ theme, expired }) => (expired ? theme.colors.warning : 'linear-gradient(180deg, #53dee9, #7645d9)')};
  border-radius: ${({ theme }) => theme.radii.default};
`

const FixedTermCardInner = styled(Box)<{ expired?: boolean }>`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme, expired }) => (expired ? 'rgba(255, 178, 55, 0.098)' : theme.colors.gradientBubblegum)};
  }
`

interface DetailsViewProps {
  total: number
  cometBalance?: number
  cometVaultBalance?: number
  cometPoolBalance?: number
  poolsBalance?: number
  cometBnbLpBalance?: number
  ifoPoolBalance?: number
  lockedCometBalance?: number
  lockedEndTime?: number
  block: number
}

const DetailsView: React.FC<React.PropsWithChildren<DetailsViewProps>> = ({
  total,
  cometBalance,
  cometVaultBalance,
  cometPoolBalance,
  poolsBalance,
  cometBnbLpBalance,
  ifoPoolBalance,
  lockedCometBalance,
  lockedEndTime,
  block,
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useCurrentBlockTimestamp()

  const { chainId } = useActiveChainId()

  const isBoostingExpired = useMemo(() => {
    return blockTimestamp && lockedEndTime !== undefined && new BigNumber(blockTimestamp?.toString()).gte(lockedEndTime)
  }, [blockTimestamp, lockedEndTime])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      {lockedCometBalance && Number.isFinite(lockedCometBalance) && (
        <Box>
          <Text>
            {isBoostingExpired
              ? t(
                  'Your vCOMETboosting was expired at the snapshot block. Renew your fixed-term staking position to activate the boost for future voting proposals.',
                )
              : t(
                  'Voting power is calculated using the staking amount and remaining staking duration of the fixed-term COMETstaking position at the block.',
                )}
          </Text>
          <Text bold m="10px 0">
            {`${t('COMETlocked:')} ${formatNumber(lockedCometBalance, 0, 2)}`}
          </Text>
          <Link external href="/pools">
            {t('Go to Pools')}
          </Link>
        </Box>
      )}
    </>,
    {
      placement: 'bottom',
    },
  )

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of COMETyou held and the remaining duration on the fixed-term staking position (if you have one) at the block detailed below. COMETheld in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBoxBorder>
        <VotingBoxCardInner>
          <Text color="secondary">{t('Your Voting Power')}</Text>
          <Text bold fontSize="20px">
            {formatNumber(total, 0, 3)}
          </Text>
        </VotingBoxCardInner>
      </VotingBoxBorder>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your voting power at block')}
        <StyledScanLink useBscCoinFallback href={getBlockExploreLink(block, 'block', chainId)} ml="8px">
          {block}
        </StyledScanLink>
      </Text>
      {cometBalance && Number.isFinite(cometBalance) ? (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Wallet')}
          </Text>
          <Text textAlign="right">{formatNumber(cometBalance, 0, 3)}</Text>
        </Flex>
      ) : null}
      {cometVaultBalance && Number.isFinite(cometVaultBalance) ? (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Flexible COMET Staking')}
          </Text>
          <Text textAlign="right">{formatNumber(cometVaultBalance, 0, 3)}</Text>
        </Flex>
      ) : null}
      {cometPoolBalance && Number.isFinite(cometPoolBalance) && (
        <>
          {lockedCometBalance === 0 ? (
            <Flex alignItems="center" justifyContent="space-between" mb="4px">
              <Flex>
                <Text color="textSubtle" fontSize="16px">
                  {t('Fixed Term COMET Staking')}
                </Text>
                {tooltipVisible && tooltip}
                <Flex ref={targetRef}>
                  <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                </Flex>
              </Flex>
              <Text color="failure" textAlign="right">
                {formatNumber(cometPoolBalance, 0, 3)}
              </Text>
            </Flex>
          ) : (
            <FixedTermWrapper expired={Boolean(isBoostingExpired)}>
              <FixedTermCardInner expired={Boolean(isBoostingExpired)}>
                <Flex>
                  <Text color="textSubtle" fontSize="16px" mr="auto">
                    {t('Fixed Term COMET Staking')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <Flex ref={targetRef}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </Flex>
                </Flex>
                <Flex mt="10px" flexDirection="column" alignItems="flex-end">
                  <Text bold color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="16px">
                    {formatNumber(cometPoolBalance, 0, 3)}
                  </Text>
                  <Flex>
                    <RocketIcon color={isBoostingExpired ? 'warning' : 'secondary'} width="15px" height="15px" />
                    <Text ml="4px" color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="12px">
                      {isBoostingExpired ? t('Boosting Expired') : t('Boosted by vCOMET')}
                    </Text>
                  </Flex>
                </Flex>
              </FixedTermCardInner>
            </FixedTermWrapper>
          )}
        </>
      )}
      {ifoPoolBalance && Number.isFinite(ifoPoolBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('IFO Pool')}
          </Text>
          <Text textAlign="right">{formatNumber(ifoPoolBalance, 0, 3)}</Text>
        </Flex>
      )}
      {poolsBalance && Number.isFinite(poolsBalance) ? (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Other Syrup Pools')}
          </Text>
          <Text textAlign="right">{formatNumber(poolsBalance, 0, 3)}</Text>
        </Flex>
      ) : null}
      {cometBnbLpBalance && Number.isFinite(cometBnbLpBalance) ? (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('COMETBNB LP')}
          </Text>
          <Text textAlign="right">{formatNumber(cometBnbLpBalance, 0, 3)}</Text>
        </Flex>
      ) : null}
    </ModalInner>
  )
}

export default DetailsView

