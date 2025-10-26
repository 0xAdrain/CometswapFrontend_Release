import { Box, Text, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface AdvancedSwapDetailsProps {
  trade?: any
  allowedSlippage?: number
}

const AdvancedSwapDetails: React.FC<AdvancedSwapDetailsProps> = ({ 
  trade, 
  allowedSlippage = 0.5 
}) => {
  const { t } = useTranslation()

  return (
    <Box p="16px" bg="backgroundAlt" borderRadius="12px">
      <Text fontSize="14px" bold mb="8px">
        {t('Advanced Details')}
      </Text>
      <Flex justifyContent="space-between" mb="4px">
        <Text fontSize="12px" color="textSubtle">
          {t('Slippage Tolerance')}
        </Text>
        <Text fontSize="12px">
          {allowedSlippage}%
        </Text>
      </Flex>
      <Flex justifyContent="space-between" mb="4px">
        <Text fontSize="12px" color="textSubtle">
          {t('Price Impact')}
        </Text>
        <Text fontSize="12px">
          {trade?.priceImpact || '< 0.01%'}
        </Text>
      </Flex>
    </Box>
  )
}

export default AdvancedSwapDetails