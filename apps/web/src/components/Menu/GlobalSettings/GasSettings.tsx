import { useTranslation } from '@cometswap/localization'
import { ChainId } from '@cometswap/sdk'
import {
  AtomBox,
  Button,
  Flex,
  InjectedModalProps,
  Message,
  MessageText,
  Modal,
  QuestionHelper,
  Text,
  Toggle,
} from '@cometswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useGasPrice, GAS_PRICE_GWEI } from 'state/user/hooks'
import { styled } from 'styled-components'

const GasSettingsModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
  }
`

const GasPriceButton = styled(Button)<{ $isActive: boolean }>`
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : theme.colors.backgroundAlt)};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : theme.colors.text)};
  border: 1px solid ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : theme.colors.cardBorder)};
  
  &:hover {
    background: ${({ $isActive, theme }) => ($isActive ? theme.colors.primaryDark : theme.colors.backgroundHover)};
  }
`

interface GasSettingsProps extends InjectedModalProps {
  // Add any additional props here
}

export const GasSettings: React.FC<GasSettingsProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [gasPrice, setGasPrice] = useGasPrice()

  const handleGasPriceChange = (newGasPrice: GAS_PRICE_GWEI) => {
    setGasPrice(newGasPrice)
  }

  // Only show gas settings for BSC
  if (chainId !== ChainId.BSC) {
    return (
      <GasSettingsModal title={t('Gas Settings')} onDismiss={onDismiss}>
        <Message variant="warning" mb="24px">
          <MessageText>
            {t('Gas settings are only available on BSC network.')}
          </MessageText>
        </Message>
      </GasSettingsModal>
    )
  }

  return (
    <GasSettingsModal title={t('Gas Settings')} onDismiss={onDismiss}>
      <AtomBox p="24px">
        <Flex flexDirection="column" gap="16px">
          <Flex alignItems="center" gap="8px">
            <Text fontSize="14px" fontWeight="600">
              {t('Default Transaction Speed (GWEI)')}
            </Text>
            <QuestionHelper
              text={t('Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.')}
              placement="top"
            />
          </Flex>

          <Flex gap="8px" flexWrap="wrap">
            <GasPriceButton
              scale="sm"
              variant="tertiary"
              $isActive={gasPrice === GAS_PRICE_GWEI.default}
              onClick={() => handleGasPriceChange(GAS_PRICE_GWEI.default)}
            >
              {t('Standard (5)')}
            </GasPriceButton>
            
            <GasPriceButton
              scale="sm"
              variant="tertiary"
              $isActive={gasPrice === GAS_PRICE_GWEI.fast}
              onClick={() => handleGasPriceChange(GAS_PRICE_GWEI.fast)}
            >
              {t('Fast (6)')}
            </GasPriceButton>
            
            <GasPriceButton
              scale="sm"
              variant="tertiary"
              $isActive={gasPrice === GAS_PRICE_GWEI.instant}
              onClick={() => handleGasPriceChange(GAS_PRICE_GWEI.instant)}
            >
              {t('Instant (10)')}
            </GasPriceButton>
          </Flex>

          <Message variant="primary">
            <MessageText>
              {t('Higher gas prices can help ensure your transactions are processed faster, but will cost more in fees.')}
            </MessageText>
          </Message>
        </Flex>
      </AtomBox>
    </GasSettingsModal>
  )
}