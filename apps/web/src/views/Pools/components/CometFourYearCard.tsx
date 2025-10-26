import { Card, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const CometFourYearCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Text fontSize="20px" bold mb="16px">
        {t('4-Year COMET Lock')}
      </Text>
      <Text color="textSubtle">
        {t('Lock your COMET for 4 years to maximize your rewards and voting power.')}
      </Text>
    </Card>
  )
}


