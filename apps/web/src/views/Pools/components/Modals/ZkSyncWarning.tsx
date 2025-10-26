import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { Box, Message, MessageText } from '@cometswap/uikit'
import { useAccount } from 'wagmi'

const ZkSyncWarning = () => {
  const { t } = useTranslation()
  const { chain } = useAccount()

  return (
    <>
      {chain?.id === ChainId.ZKSYNC || chain?.id === ChainId.ZKSYNC_TESTNET ? (
        <Box maxWidth={['100%', '100%', '100%', '307px']}>
          <Message variant="warning" m="24px 0 0 0">
            <MessageText>
              {t(
                'When staking on zkSync Era, unstaking your COMETshortly after staking could result in no rewards being earned.',
              )}
            </MessageText>
          </Message>
        </Box>
      ) : null}
    </>
  )
}

export default ZkSyncWarning

