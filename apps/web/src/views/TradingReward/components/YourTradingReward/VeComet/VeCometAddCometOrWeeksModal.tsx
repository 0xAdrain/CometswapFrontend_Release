import { Modal, ModalProps, Text, Button, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export enum VeCometModalView {
  ADD_COMET = 'ADD_COMET',
  ADD_WEEKS = 'ADD_WEEKS',
}

interface VeCometAddCometOrWeeksModalProps extends ModalProps {
  view?: VeCometModalView
  onViewChange?: (view: VeCometModalView) => void
}

export const VeCometAddCometOrWeeksModal: React.FC<VeCometAddCometOrWeeksModalProps> = ({ 
  view = VeCometModalView.ADD_COMET,
  onViewChange,
  ...props 
}) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Manage veComet')} {...props}>
      <Flex gap="12px" mb="24px">
        <Button
          variant={view === VeCometModalView.ADD_COMET ? 'primary' : 'secondary'}
          onClick={() => onViewChange?.(VeCometModalView.ADD_COMET)}
          width="50%"
        >
          {t('Add COMET')}
        </Button>
        <Button
          variant={view === VeCometModalView.ADD_WEEKS ? 'primary' : 'secondary'}
          onClick={() => onViewChange?.(VeCometModalView.ADD_WEEKS)}
          width="50%"
        >
          {t('Extend Lock')}
        </Button>
      </Flex>
      
      <Text color="textSubtle" textAlign="center">
        {view === VeCometModalView.ADD_COMET 
          ? t('Add more COMET to increase your veComet balance')
          : t('Extend your lock duration to maintain voting power')
        }
      </Text>
    </Modal>
  )
}




