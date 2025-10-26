import { useTranslation } from '@cometswap/localization'
import { ChainId, ERC20Token } from '@cometswap/sdk'
import {
  Box,
  Button,
  FlexGap,
  LinkExternal,
  Modal,
  ModalV2,
  RiskAlertIcon,
  Text,
  useModal,
} from '@cometswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { useTokenRisk } from './hooks/useTokenRisk'
import { TOKEN_RISK } from './types'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
  }
`

interface SwapRevampRiskDisplayProps {
  token?: ERC20Token
}

export const SwapRevampRiskDisplay: React.FC<SwapRevampRiskDisplayProps> = ({ token }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [showRiskModal, setShowRiskModal] = useState(false)

  const { tokenRisk, loading } = useTokenRisk(token?.address, chainId)

  const riskLevel = useMemo(() => {
    if (!tokenRisk || loading) return null
    
    if (tokenRisk.risk_level >= TOKEN_RISK.VERY_HIGH) return 'VERY_HIGH'
    if (tokenRisk.risk_level >= TOKEN_RISK.HIGH) return 'HIGH'
    if (tokenRisk.risk_level >= TOKEN_RISK.MEDIUM) return 'MEDIUM'
    return 'LOW'
  }, [tokenRisk, loading])

  const riskColor = useMemo(() => {
    switch (riskLevel) {
      case 'VERY_HIGH':
        return 'failure'
      case 'HIGH':
        return 'warning'
      case 'MEDIUM':
        return 'warning'
      default:
        return 'success'
    }
  }, [riskLevel])

  const handleShowRiskModal = useCallback(() => {
    setShowRiskModal(true)
  }, [])

  const handleHideRiskModal = useCallback(() => {
    setShowRiskModal(false)
  }, [])

  if (!token || !tokenRisk || loading || riskLevel === 'LOW') {
    return null
  }

  return (
    <>
      <Box
        onClick={handleShowRiskModal}
        style={{ cursor: 'pointer' }}
        p="8px"
        backgroundColor="backgroundAlt"
        borderRadius="8px"
      >
        <FlexGap gap="8px" alignItems="center">
          <RiskAlertIcon color={riskColor} width="16px" />
          <Text fontSize="12px" color={riskColor} fontWeight="600">
            {t('Risk Warning')}
          </Text>
        </FlexGap>
      </Box>

      <StyledModal
        title={t('Token Risk Warning')}
        isOpen={showRiskModal}
        onDismiss={handleHideRiskModal}
        headerBackground="gradientCardHeader"
      >
        <Box p="24px">
          <FlexGap gap="16px" flexDirection="column">
            <FlexGap gap="8px" alignItems="center">
              <RiskAlertIcon color={riskColor} width="24px" />
              <Text fontSize="16px" fontWeight="600" color={riskColor}>
                {riskLevel === 'VERY_HIGH' && t('Very High Risk')}
                {riskLevel === 'HIGH' && t('High Risk')}
                {riskLevel === 'MEDIUM' && t('Medium Risk')}
              </Text>
            </FlexGap>

            <Text fontSize="14px" color="textSubtle">
              {t('This token has been flagged as potentially risky. Please do your own research before trading.')}
            </Text>

            {tokenRisk.risk_items && tokenRisk.risk_items.length > 0 && (
              <Box>
                <Text fontSize="14px" fontWeight="600" mb="8px">
                  {t('Risk Factors:')}
                </Text>
                {tokenRisk.risk_items.map((item, index) => (
                  <Text key={index} fontSize="12px" color="textSubtle" mb="4px">
                    • {item}
                  </Text>
                ))}
              </Box>
            )}

            <FlexGap gap="12px" mt="16px">
              <Button variant="secondary" onClick={handleHideRiskModal} scale="sm">
                {t('I Understand')}
              </Button>
              <LinkExternal
                href={`https://gopluslabs.io/token-security/${chainId}/${token?.address}`}
                fontSize="12px"
              >
                {t('View Details')}
              </LinkExternal>
            </FlexGap>
          </FlexGap>
        </Box>
      </StyledModal>
    </>
  )
}