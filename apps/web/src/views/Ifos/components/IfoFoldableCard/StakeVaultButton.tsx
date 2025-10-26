import { useTranslation } from '@cometswap/localization'
import { isCometVaultSupported } from '@cometswap/pools'
import { Button, Flex, Text, useModalV2 } from '@cometswap/uikit'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useConfig } from 'views/Ifos/contexts/IfoContext'

import { isTestnetChainId } from '@cometswap/chains'
import { useChainNames } from '../../hooks/useChainNames'
import { ICometLogo } from '../Icons'
import { NetworkSwitcherModal } from './IfoPoolCard/NetworkSwitcherModal'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig() as any
  const isFinishedPage = router.pathname.includes('history')
  const cakeVaultSupported = useMemo(() => isCometVaultSupported(chainId), [chainId])

  // Multi-chain support removed - single chain deployment only
  const cakeVaultChainNames = []

  const { onOpen, onDismiss, isOpen } = useModalV2()

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  const handleClickButton = useCallback(() => {
    if (!cakeVaultSupported) {
      onOpen()
      return
    }

    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    if (isFinishedPage) {
      router.push('/ifo')
    } else {
      scrollToTop()
    }
  }, [cakeVaultSupported, onOpen, isExpanded, isFinishedPage, router, scrollToTop, setIsExpanded])

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <ICometLogo />
      <Text mt="0.625rem">{t('Stake COMETto obtain iCOMET- in order to be eligible in the next IFO.')}</Text>
    </Flex>
  )

  return (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={supportedChainIds}
        title={t('Lock COMET')}
        description={t('Lock COMETon %chain% to obtain iCOMET', {
          chain: cakeVaultChainNames,
        })}
        buttonText={t('Switch chain to stake COMET')}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button {...props} onClick={handleClickButton}>
        {t('Go to COMETpool')}
      </Button>
    </>
  )
}

export default StakeVaultButton

