import { Card, Text, Button } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const NotLockingCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Text fontSize="16px" bold mb="8px">
        {t('No COMET Locked')}
      </Text>
      <Text color="textSubtle" mb="16px">
        {t('Lock your COMET to start earning rewards and gain voting power.')}
      </Text>
      <Button>
        {t('Lock COMET')}
      </Button>
    </Card>
  )
}


