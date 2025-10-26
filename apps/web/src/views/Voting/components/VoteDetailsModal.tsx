import { useTranslation } from '@cometswap/localization'
import { Box, Button, Flex, InjectedModalProps, Modal, Spinner } from '@cometswap/uikit'
import useTheme from 'hooks/useTheme'
import { VECOMET_VOTING_POWER_BLOCK } from '../helpers'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'
import { VeMainView } from './CastVoteModal/MainView'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<React.PropsWithChildren<VoteDetailsModalProps>> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const {
    isLoading,
    total,
    cometBalance,
    cometVaultBalance,
    cometPoolBalance,
    poolsBalance,
    cometBnbLpBalance,
    ifoPoolBalance,
    lockedCometBalance,
    lockedEndTime,
    vecometBalance,
  } = useGetVotingPower(block)
  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Box mb="24px" width={['100%', '100%', '100%', '320px']}>
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            {!block || BigInt(block) >= VECOMET_VOTING_POWER_BLOCK ? (
              <VeMainView block={block} total={total} vecometBalance={vecometBalance} />
            ) : (
              <DetailsView
                total={total}
                cometBalance={cometBalance}
                cometVaultBalance={cometVaultBalance}
                cometPoolBalance={cometPoolBalance}
                poolsBalance={poolsBalance}
                ifoPoolBalance={ifoPoolBalance}
                cometBnbLpBalance={cometBnbLpBalance}
                lockedCometBalance={lockedCometBalance}
                lockedEndTime={lockedEndTime}
                block={block}
              />
            )}
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t('Close')}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal

