import { useTranslation } from '@cometswap/localization'
import { AutoColumn, Button, Flex, Text } from '@cometswap/uikit'

interface TxErrorModalContentProps {
  error?: string
  onDismiss?: () => void
}

export const TxErrorModalContent: React.FC<TxErrorModalContentProps> = ({ error, onDismiss }) => {
  const { t } = useTranslation()

  return (
    <AutoColumn gap="24px" style={{ padding: '24px' }}>
      <Flex flexDirection="column" alignItems="center" gap="16px">
        <Text fontSize="20px" fontWeight="600" color="failure">
          {t('Transaction Failed')}
        </Text>
        
        <Text fontSize="14px" color="textSubtle" textAlign="center">
          {error || t('An error occurred while processing your transaction. Please try again.')}
        </Text>
      </Flex>

      <Button onClick={onDismiss} width="100%">
        {t('Close')}
      </Button>
    </AutoColumn>
  )
}