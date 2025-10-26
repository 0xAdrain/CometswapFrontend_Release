import { Box, Text, Button, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface SwapModalFooterV2Props {
  onConfirm?: () => void
  onDismiss?: () => void
  isLoading?: boolean
  disabled?: boolean
}

const SwapModalFooterV2: React.FC<SwapModalFooterV2Props> = ({ 
  onConfirm, 
  onDismiss, 
  isLoading, 
  disabled 
}) => {
  const { t } = useTranslation()

  return (
    <Box p="24px">
      <Flex gap="12px">
        <Button variant="secondary" onClick={onDismiss} width="50%">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={onConfirm} 
          width="50%"
          isLoading={isLoading}
          disabled={disabled}
        >
          {t('Confirm Swap')}
        </Button>
      </Flex>
      <Text fontSize="12px" color="textSubtle" textAlign="center" mt="12px">
        {t('Output is estimated. You will receive at least the minimum amount or the transaction will revert.')}
      </Text>
    </Box>
  )
}

export default SwapModalFooterV2