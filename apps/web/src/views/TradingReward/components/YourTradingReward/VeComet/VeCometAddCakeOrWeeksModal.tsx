import { useTranslation } from '@cometswap/localization'
import { ArrowUpDownIcon, Box, Flex, InjectedModalProps, Modal, Text, useMatchBreakpoints } from '@cometswap/uikit'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { LockCometForm } from 'views/CometStaking/components/LockCometForm'
import { LockWeeksForm } from 'views/CometStaking/components/LockWeeksForm'
import { PreviewOfVeCometSnapShotTime } from 'views/TradingReward/components/YourTradingReward/VeComet/PreviewOfVeCometSnapShotTime'

const StyledSwitchTextContainer = styled(Flex)`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1;
`

export enum VeCometModalView {
  COMET_FORM_VIEW = 'COMET_FORM_VIEW',
  WEEKS_FORM_VIEW = 'WEEKS_FORM_VIEW',
}

interface VeCometAddCometOrWeeksModalProps extends InjectedModalProps {
  viewMode?: VeCometModalView
  showSwitchButton?: boolean
  endTime?: number
  thresholdLockAmount: number
}

export const VeCometAddCometOrWeeksModal: React.FC<React.PropsWithChildren<VeCometAddCometOrWeeksModalProps>> = ({
  viewMode,
  showSwitchButton,
  endTime,
  thresholdLockAmount,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [modalViewMode, setModalViewMode] = useState(VeCometModalView.COMET_FORM_VIEW)

  useEffect(() => {
    if (viewMode) {
      setModalViewMode(viewMode)
    }
  }, [viewMode])

  const toggleViewMode = () => {
    const mode =
      modalViewMode === VeCometModalView.COMET_FORM_VIEW
        ? VeCometModalView.WEEKS_FORM_VIEW
        : VeCometModalView.COMET_FORM_VIEW
    setModalViewMode(mode)
  }

  const customVeCometCard = endTime ? (
    <Box mt="16px" width="100%">
      <Text mb="8px" fontSize={12} bold color={isDesktop ? 'textSubtle' : undefined} textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <PreviewOfVeCometSnapShotTime
        viewMode={modalViewMode}
        endTime={endTime}
        thresholdLockAmount={thresholdLockAmount}
      />
    </Box>
  ) : null

  return (
    <Modal
      title="Increase your veCOMET"
      headerBorderColor="transparent"
      maxWidth={['100%', '100%', '100%', '500px']}
      onDismiss={onDismiss}
    >
      {showSwitchButton && (
        <StyledSwitchTextContainer onClick={toggleViewMode}>
          <ArrowUpDownIcon mr="4px" color="primary" style={{ rotate: '90deg' }} />
          <Text bold color="primary">
            {modalViewMode === VeCometModalView.COMET_FORM_VIEW ? t('Extend Lock Instead') : t('Add COMET Instead')}
          </Text>
        </StyledSwitchTextContainer>
      )}
      <Flex position="relative">
        {modalViewMode === VeCometModalView.COMET_FORM_VIEW ? (
          <LockCometForm hideLockCometDataSetStyle customVeCometCard={customVeCometCard} onDismiss={onDismiss} />
        ) : (
          <LockWeeksForm hideLockWeeksDataSetStyle customVeCometCard={customVeCometCard} onDismiss={onDismiss} />
        )}
      </Flex>
    </Modal>
  )
}
