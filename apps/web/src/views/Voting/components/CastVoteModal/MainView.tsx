import { useTranslation } from '@cometswap/localization'
import {
  AutoRenewIcon,
  Button,
  ChevronRightIcon,
  Flex,
  IconButton,
  Message,
  RocketIcon,
  Skeleton,
  Text,
} from '@cometswap/uikit'
import { formatNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useMemo } from 'react'
import { Proposal, ProposalTypeName } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { MyCometCard } from 'views/CometStaking/components/MyCometCard'
import { WeightedVoteResults } from 'views/Voting/Proposal/ResultType/WeightedVoteResults'
import { SingleVoteState, VoteState, WeightedVoteState } from 'views/Voting/Proposal/VoteType/types'
import TextEllipsis from '../TextEllipsis'
import { StyledScanLink } from './DetailsView'
import { ModalInner, VotingBoxBorder, VotingBoxCardInner } from './styles'
import { CastVoteModalProps } from './types'

const TextEllipsisStyled = styled(TextEllipsis)`
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const WeightedVoteResultsContainer = styled(Flex)`
  padding: 0 12px 12px 12px;
  border-radius: 16px;
  margin-bottom: 24px;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};

  > div {
    margin-top: 12px;
    > div {
      &:first-child {
        margin-bottom: 0;
      }
    }
  }
`

interface MainViewProps {
  vote: VoteState
  isLoading: boolean
  isPending: boolean
  isError: boolean
  total: number
  disabled?: boolean
  lockedCometBalance: number
  lockedEndTime: number
  proposal: Proposal
  voteType?: ProposalTypeName
  onConfirm: () => void
  onViewDetails: () => void
  onDismiss: CastVoteModalProps['onDismiss']
}

type VeMainViewProps = {
  vote?: VoteState
  isLoading?: boolean
  isPending?: boolean
  isError?: boolean
  total: number
  disabled?: boolean
  vecometBalance?: number
  voteType?: ProposalTypeName
  onConfirm?: () => void
  onDismiss?: CastVoteModalProps['onDismiss']
  block: number
  proposal?: Proposal
}

export const VeMainView = ({
  vote,
  total,
  proposal,
  isPending,
  isLoading,
  isError,
  onConfirm,
  onDismiss,
  disabled,
  block,
  voteType,
  vecometBalance,
}: VeMainViewProps) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  return (
    <>
      <ModalInner>
        {vote ? (
          <>
            <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
              {t('Voting For')}
            </Text>
            {voteType === ProposalTypeName.WEIGHTED && proposal ? (
              <WeightedVoteResultsContainer>
                <WeightedVoteResults choicesVotes={[vote as WeightedVoteState]} choices={proposal.choices} />
              </WeightedVoteResultsContainer>
            ) : (
              <TextEllipsisStyled title={(vote as SingleVoteState).label}>{vote.label}</TextEllipsisStyled>
            )}
          </>
        ) : null}

        <Text color="secondary" textTransform="uppercase" bold fontSize="14px">
          {t('Your voting power at block')}
          <StyledScanLink useBscCoinFallback href={getBlockExploreLink(block, 'block', chainId)} ml="8px">
            {block}
          </StyledScanLink>
        </Text>
        {isLoading && !isError ? (
          <Skeleton height="64px" mb="12px" />
        ) : isError ? (
          <Message variant="danger" mb="12px">
            <Text color="text">{t('Error occurred, please try again later')}</Text>
          </Message>
        ) : total === 0 || total === undefined ? (
          <Message variant="danger" mb="12px">
            <Text color="danger">
              {t(
                'Hold some COMETin your wallet or on CometSwap at the snapshot block to get voting power for future proposals.',
              )}
            </Text>
          </Message>
        ) : (
          <>
            <br />
            <MyCometCard type="row" value={!vecometBalance ? '0' : String(vecometBalance)} />
            <br />
            <Text color="textSubtle" fontSize="14px">
              {t(
                'Your voting power is determined by the number of veCOMETyou have at the block detailed above. COMETheld in other places does NOT contribute to your voting power.',
              )}
            </Text>
            <br />
            {onConfirm && (
              <Text fontSize="14px" color="textSubtle">
                {t('Once confirmed, voting action cannot be undone.')}
              </Text>
            )}
          </>
        )}
      </ModalInner>
      {onConfirm && (
        <Button
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={disabled || isLoading || total === 0 || total === undefined}
          width="100%"
          mb="8px"
          onClick={onConfirm}
        >
          {t('Confirm Vote')}
        </Button>
      )}
      {onDismiss && (
        <Button variant="secondary" width="100%" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
      )}
    </>
  )
}

const MainView: React.FC<React.PropsWithChildren<MainViewProps>> = ({
  vote,
  total,
  isPending,
  isLoading,
  isError,
  voteType,
  proposal,
  onConfirm,
  onViewDetails,
  onDismiss,
  disabled,
  lockedCometBalance,
  lockedEndTime,
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useCurrentBlockTimestamp()

  const hasLockedComet = lockedCometBalance > 0

  const isBoostingExpired = useMemo(() => {
    return lockedEndTime !== 0 && new BigNumber(blockTimestamp?.toString() ?? 0).gte(lockedEndTime)
  }, [blockTimestamp, lockedEndTime])

  const hasBoosted = hasLockedComet && !isBoostingExpired

  return (
    <>
      <ModalInner>
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Voting For')}
        </Text>
        {voteType === ProposalTypeName.WEIGHTED ? (
          <WeightedVoteResultsContainer>
            <WeightedVoteResults choicesVotes={[vote as WeightedVoteState]} choices={proposal.choices} />
          </WeightedVoteResultsContainer>
        ) : (
          <TextEllipsisStyled title={(vote as SingleVoteState).label}>{vote.label}</TextEllipsisStyled>
        )}
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Your Voting Power')}
        </Text>
        {isLoading && !isError ? (
          <Skeleton height="64px" mb="12px" />
        ) : isError ? (
          <Message variant="danger" mb="12px">
            <Text color="text">{t('Error occurred, please try again later')}</Text>
          </Message>
        ) : (
          <>
            <VotingBoxBorder hasBoosted={hasBoosted} onClick={onViewDetails} style={{ cursor: 'pointer' }}>
              <VotingBoxCardInner hasBoosted={hasBoosted}>
                <Flex flexDirection="column">
                  <Text bold fontSize="20px" color={total === 0 ? 'failure' : 'text'}>
                    {formatNumber(total, 0, 3)}
                  </Text>
                  {hasLockedComet && (
                    <Flex>
                      <RocketIcon color={isBoostingExpired ? 'warning' : 'secondary'} width="15px" height="15px" />
                      <Text ml="4px" bold color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="14px">
                        {isBoostingExpired ? t('Boosting Expired') : t('Boosted by vCOMET')}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                <IconButton scale="sm" variant="text">
                  <ChevronRightIcon width="24px" />
                </IconButton>
              </VotingBoxCardInner>
            </VotingBoxBorder>
            {total === 0 ? (
              <Message variant="danger" mb="12px">
                <Text color="danger">
                  {t(
                    'Hold some COMETin your wallet or on CometSwap at the snapshot block to get voting power for future proposals.',
                  )}
                </Text>
              </Message>
            ) : (
              <Text as="p" color="textSubtle" fontSize="14px">
                {t('Are you sure you want to vote for the above choice? This action cannot be undone.')}
              </Text>
            )}
          </>
        )}
      </ModalInner>
      <Button
        isLoading={isPending}
        endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={disabled || isLoading || total === 0}
        width="100%"
        mb="8px"
        onClick={onConfirm}
      >
        {t('Confirm Vote')}
      </Button>
      <Button variant="secondary" width="100%" onClick={onDismiss}>
        {t('Cancel')}
      </Button>
    </>
  )
}

export default MainView

