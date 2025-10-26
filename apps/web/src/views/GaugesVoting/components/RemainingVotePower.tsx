import { useTranslation } from '@cometswap/localization'
import { Balance, Box, ErrorIcon, Flex, FlexGap, Text } from '@cometswap/uikit'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CometStaking/components/Tooltips'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { useEpochVotePower } from '../hooks/useEpochVotePower'

const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #1fc7d4 -13.69%, #7645d9 91.33%);
  padding: 18px;
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 460px;
  }
`

export const RemainingVotePower: React.FC<{
  votedPercent: number
}> = ({ votedPercent }) => {
  const { t } = useTranslation()

  const { cometLockedAmount } = useVeCometLockStatus()
  const locked = useMemo(() => cometLockedAmount > 0n, [cometLockedAmount])
  const { balance: vecometBalance } = useVeCometBalance()
  const { data: epochPower } = useEpochVotePower()

  // @note: real power is EpochEndPower * (10000 - PercentVoted)
  // use vecometBalance as cardinal number for better UX understanding
  const votePower = useMemo(() => {
    return vecometBalance.times(10000 - votedPercent * 100).dividedBy(10000)
  }, [vecometBalance, votedPercent])

  const realPower = useMemo(() => {
    return new BN(epochPower.toString()).times(10000 - votedPercent * 100).dividedBy(10000)
  }, [epochPower, votedPercent])

  return (
    <StyledBox id="Comet-vote-power">
      <img src="/images/comet-staking/token-Comet.png" alt="token-Comet" width="58px" />
      <Flex
        flexDirection={['column', 'column', 'row']}
        justifyContent="space-between"
        width="100%"
        ml="4px"
        alignItems={['flex-start', 'flex-start', 'center']}
      >
        <Text fontSize="20px" bold color="white" lineHeight="2">
          {t('Remaining veCOMET')}
        </Text>
        {epochPower === 0n && realPower.gt(0) ? (
          <FlexGap gap="4px" alignItems="center">
            <Text textTransform="uppercase" color="warning" bold fontSize={24}>
              {t('unlocking')}
            </Text>
            <Tooltips
              content={
                <>
                  {t(
                    'Your positions are unlocking soon. Therefore, you have no veCOMETbalance at the end of the current voting epoch while votes are being tallied. ',
                  )}
                  <br />
                  <br />
                  {t('Extend your lock to cast votes.')}
                </>
              }
            >
              <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} />
            </Tooltips>
          </FlexGap>
        ) : (
          <Tooltips
            disabled={locked}
            content={
              <>
                {t('You have no locked COMET.')} {t('To cast your vote, lock your COMETfor 3 weeks or more.')}
              </>
            }
          >
            <FlexGap gap="4px" alignItems="center">
              <Balance
                fontSize="24px"
                bold
                color={locked ? 'white' : 'warning'}
                lineHeight="110%"
                value={getBalanceNumber(votePower) || 0}
                decimals={2}
              />
              {!locked ? <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} /> : null}
            </FlexGap>
          </Tooltips>
        )}
      </Flex>
    </StyledBox>
  )
}

