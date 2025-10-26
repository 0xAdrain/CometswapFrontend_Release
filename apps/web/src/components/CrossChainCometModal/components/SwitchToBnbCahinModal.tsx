import { Modal, ModalProps, Text, Button } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface SwitchToBnbChainModalProps extends ModalProps {
  onSwitchChain?: () => void
}

export const SwitchToBnbChainModal: React.FC<SwitchToBnbChainModalProps> = ({ 
  onSwitchChain, 
  ...props 
}) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Switch to BNB Chain')} {...props}>
      <Text mb="16px">
        {t('Please switch to BNB Chain to continue with this action.')}
      </Text>
      <Button onClick={onSwitchChain} width="100%">
        {t('Switch to BNB Chain')}
      </Button>
    </Modal>
  )
}




