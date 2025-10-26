import { Card, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const CometCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Text>
        {t('COMET Card - Feature not implemented')}
      </Text>
    </Card>
  )
}


