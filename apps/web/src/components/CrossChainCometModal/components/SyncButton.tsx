import { Button, ButtonProps } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface SyncButtonProps extends ButtonProps {
  onSync?: () => void
  isSyncing?: boolean
}

export const SyncButton: React.FC<SyncButtonProps> = ({ onSync, isSyncing, ...props }) => {
  const { t } = useTranslation()

  return (
    <Button 
      onClick={onSync} 
      isLoading={isSyncing}
      {...props}
    >
      {props.children || t('Sync')}
    </Button>
  )
}


