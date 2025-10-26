import { Card, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const MyCometCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Text fontSize="14px" color="textSubtle">
        {t('My COMET Card - Feature not implemented')}
      </Text>
    </Card>
  )
}


