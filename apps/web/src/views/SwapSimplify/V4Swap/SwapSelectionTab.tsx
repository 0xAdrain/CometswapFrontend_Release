import { Box, Text, Button, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { styled } from 'styled-components'

const TabContainer = styled(Flex)`
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 4px;
`

const TabButton = styled(Button)<{ $active?: boolean }>`
  background: ${({ $active, theme }) => ($active ? theme.colors.background : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.text : theme.colors.textSubtle)};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  
  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.background : theme.colors.tertiary)};
  }
`

interface SwapSelectionTabProps {
  activeTab?: 'market' | 'limit'
  onTabChange?: (tab: 'market' | 'limit') => void
}

const SwapSelectionTab: React.FC<SwapSelectionTabProps> = ({ 
  activeTab = 'market', 
  onTabChange 
}) => {
  const { t } = useTranslation()

  return (
    <TabContainer>
      <TabButton
        $active={activeTab === 'market'}
        onClick={() => onTabChange?.('market')}
        width="50%"
      >
        {t('Market')}
      </TabButton>
      <TabButton
        $active={activeTab === 'limit'}
        onClick={() => onTabChange?.('limit')}
        width="50%"
      >
        {t('Limit')}
      </TabButton>
    </TabContainer>
  )
}

export default SwapSelectionTab