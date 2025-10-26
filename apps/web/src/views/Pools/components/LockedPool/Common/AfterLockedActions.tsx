import { useTranslation } from '@cometswap/localization'
import { Box, Flex, Message, MessageText, useMatchBreakpoints } from '@cometswap/uikit'
import Trans from 'components/Trans'
import { ReactNode, memo } from 'react'
import { VaultPosition } from 'utils/cometPool'
// Migration hook removed
import WithdrawAllButton from '../Buttons/WithdrawAllButton'
import { AfterLockedActionsPropsType } from '../types'

const msg: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: null,
  [VaultPosition.Locked]: null,
  [VaultPosition.LockedEnd]: (
    <Trans>
      Extending or adding COMETis not available for migrated positions. To get more veCOMET, withdraw from the unlocked
      COMETpool position, and add COMETto veCOMET.
    </Trans>
  ),
  [VaultPosition.AfterBurning]: (
    <Trans>
      Extending or adding COMETis not available for migrated positions. To get more veCOMET, withdraw from the unlocked
      COMETpool position, and add COMETto veCOMET.
    </Trans>
  ),
}

const AfterLockedActions: React.FC<React.PropsWithChildren<AfterLockedActionsPropsType>> = ({
  position,
  isInline,
  hideConvertToFlexibleButton,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const isDesktopView = isInline && isDesktop
  const Container = isDesktopView ? Flex : Box
  // Migration check removed
  const { t } = useTranslation()

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt={!isDesktopView ? '8px' : undefined} ml="10px">
          {/* <ExtendButton
            modalTitle={t('Renew')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            stakingTokenPrice={stakingTokenPrice}
            currentLockedAmount={currentLockedAmount}
            minWidth="186px"
            variant="primary"
            mr={isDesktopView && '14px'}
            mb={!isDesktopView && '8px'}
            isRenew
            customLockWeekInSeconds={customLockWeekInSeconds}
          >
            {t('Renew')}
          </ExtendButton> */}
          {!hideConvertToFlexibleButton && <WithdrawAllButton minWidth={isDesktopView ? '200px' : undefined} />}
        </Container>
      }
      actionInline={isDesktopView}
    >
      <MessageText>
        {t(
          'The lock period has ended. To get more veCOMET, withdraw from the unlocked COMETpool position, and add COMETto veCOMET.',
        )}
      </MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)

