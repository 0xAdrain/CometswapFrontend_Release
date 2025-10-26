import { Box, Text, Card, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { formatNumber } from '@cometswap/utils/formatBalance'

interface PrizeFundsProps {
  totalPrize?: string
  currency?: string
}

const PrizeFunds: React.FC<PrizeFundsProps> = ({ 
  totalPrize = '0', 
  currency = 'COMET' 
}) => {
  const { t } = useTranslation()

  return (
    <Card>
      <Box p="24px">
        <Text fontSize="14px" color="textSubtle" mb="8px">
          {t('Total Prize Fund')}
        </Text>
        <Flex alignItems="center" gap="8px">
          <Text fontSize="32px" bold color="primary">
            {formatNumber(parseFloat(totalPrize), 0, 2)}
          </Text>
          <Text fontSize="16px" color="textSubtle">
            {currency}
          </Text>
        </Flex>
      </Box>
    </Card>
  )
}

export default PrizeFunds