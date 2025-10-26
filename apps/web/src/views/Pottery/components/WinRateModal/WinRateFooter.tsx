import { Box, Text, Button, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface WinRateFooterProps {
  onDismiss?: () => void
}

const WinRateFooter: React.FC<WinRateFooterProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="14px" color="textSubtle">
          {t('Win rates are calculated based on historical data')}
        </Text>
        <Button variant="secondary" onClick={onDismiss}>
          {t('Close')}
        </Button>
      </Flex>
    </Box>
  )
}

export default WinRateFooter