import { ChainId } from '@cometswap/chains'
import { ModalV2 } from '@cometswap/uikit'
import useVeCometBenefits from 'components/Menu/UserMenu/hooks/useVeCometBenefits'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallback, useEffect, useState } from 'react'
import { VaultPosition } from 'utils/cometPool'
import JoinRevenueModal from 'views/Pools/components/RevenueSharing/JoinRevenueModal'
import useVComet from 'views/Pools/hooks/useVComet'
import { useAccountEffect } from 'wagmi'

const VCometModal = () => {
  const { account, chainId } = useAccountActiveChain()
  const { isInitialization, refresh } = useVComet()
  const [open, setOpen] = useState(false)
  const { data: cakeBenefits, status: cakeBenefitsFetchStatus } = useVeCometBenefits()

  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (
      account &&
      chainId === ChainId.BSC &&
      isInitialization === false &&
      cakeBenefitsFetchStatus === 'success' &&
      cakeBenefits?.lockPosition === VaultPosition.Locked
    ) {
      setOpen(true)
    }
  }, [account, cakeBenefits?.lockPosition, cakeBenefitsFetchStatus, chainId, isInitialization])

  useAccountEffect({
    onConnect: closeModal,
    onDisconnect: closeModal,
  })

  return (
    <ModalV2 isOpen={open} onDismiss={closeModal}>
      <JoinRevenueModal refresh={refresh} onDismiss={closeModal} />
    </ModalV2>
  )
}

export default VCometModal

