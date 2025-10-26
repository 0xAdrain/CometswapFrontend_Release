import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { Button } from '@cometswap/uikit'
import { NextButton } from 'components/CrossChainCometModal/components/NextButton'
import { SyncButton } from 'components/CrossChainCometModal/components/SyncButton'
import { useStatusViewCometWellSync } from 'components/CrossChainCometModal/hooks/useMultichainCometWellSynced'
import NextLink from 'next/link'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const StatusViewButtons: React.FC<{
  updateButton: React.ReactElement | null
  locked: boolean
  isTableView?: boolean
}> = ({ updateButton, locked, isTableView = false }) => {
  const { chainId, address: account } = useAccount()
  const { t } = useTranslation()
  const { isCometWillSync } = useStatusViewCometWellSync(chainId)
  const isBnbChain = useMemo(() => {
    return chainId === ChainId.BSC
  }, [chainId])
  return (
    <>
      {!locked &&
        (!isBnbChain ? (
          <NextButton width={isTableView ? 'auto' : undefined} />
        ) : (
          <NextLink href="/comet-staking" passHref>
            <Button width="100%" style={{ whiteSpace: 'nowrap' }}>
              {t('Go to Lock')}
            </Button>
          </NextLink>
        ))}
      {account && !isCometWillSync && !isBnbChain ? (
        <SyncButton width={isTableView ? 'auto' : undefined} />
      ) : (
        updateButton
      )}
    </>
  )
}

