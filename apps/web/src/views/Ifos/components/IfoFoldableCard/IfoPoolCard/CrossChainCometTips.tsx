import { Box, Text } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

export const CrossChainCometTips = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize="14px" color="textSubtle">
        {t('Cross Chain COMET Tips - Feature not implemented')}
      </Text>
    </Box>
  )
}




