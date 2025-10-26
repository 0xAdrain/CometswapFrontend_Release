import { Card, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const CrossChainCometCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Text>
        {t('Cross Chain COMET Card - Feature not implemented')}
      </Text>
    </Card>
  )
}




