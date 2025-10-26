import { Card, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import BigNumber from 'bignumber.js'

export const MyCometBalance = () => {
  const { t } = useTranslation()
  const balance = new BigNumber(0)

  return (
    <Card>
      <Text fontSize="14px" color="textSubtle">
        {t('My COMET Balance')}
      </Text>
      <Text fontSize="20px" bold>
        {balance.toFixed(2)}
      </Text>
    </Card>
  )
}


