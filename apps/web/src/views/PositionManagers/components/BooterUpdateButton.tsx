import { useTranslation } from '@cometswap/localization'
import { Button } from '@cometswap/uikit'

export const BoosterUpdateButton: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  const { t } = useTranslation()
  return <Button onClick={onUpdate}>{t('Update')}</Button>
}

