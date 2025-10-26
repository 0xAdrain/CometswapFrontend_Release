import { useTranslation } from '@cometswap/localization'
import { Box, Text } from '@cometswap/uikit'

export const AthWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>{t('Warning: The $ATH token pool is not a valid token trading pair - please stop buying')}</Text>
    </Box>
  )
}

