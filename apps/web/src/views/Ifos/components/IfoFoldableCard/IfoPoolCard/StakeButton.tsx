import { useTranslation } from '@cometswap/localization'
import { isCometVaultSupported } from '@cometswap/pools'
import { Button, Flex, Text, useModalV2 } from '@cometswap/uikit'
import { useCallback, useMemo } from 'react'
import { SpaceProps } from 'styled-system'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { isTestnetChainId } from '@cometswap/chains'
import { useRouter } from 'next/router'
import { useChainNames } from '../../../hooks/useChainNames'
import { ICometLogo } from '../../Icons'
import { NetworkSwitcherModal } from './NetworkSwitcherModal'

interface StakeButtonProps extends SpaceProps {}

export function StakeButton(props: StakeButtonProps) {
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const cakeVaultSupported = useMemo(() => isCometVaultSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()

  // Multi-chain support removed - single chain deployment only
  const chainNames = []

  const goToCometStakingPage = useCallback(() => router.push('/comet-staking'), [router])

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <ICometLogo />
      <Text mt="0.625rem">{t('Stake COMETto obtain iCOMET- in order to be eligible in this public sale.')}</Text>
    </Flex>
  )

  return !cakeVaultSupported ? (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={supportedChainIds}
        title={t('Stake COMET')}
        description={t('Lock COMETon %chain% to obtain iCOMET', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake COMET')}
        tips={tips}
        onDismiss={onDismiss}
        onSwitchNetworkSuccess={goToCometStakingPage}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Stake COMET')}
      </Button>
    </>
  ) : null
}

