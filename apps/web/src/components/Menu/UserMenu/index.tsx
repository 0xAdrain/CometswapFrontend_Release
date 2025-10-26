import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import {
  Box,
  Flex,
  LogoutIcon,
  RefreshIcon,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  useModal,
  WalletFilledV2Icon,
} from '@cometswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAirdropModalStatus from 'components/GlobalCheckClaimStatus/hooks/useAirdropModalStatus'
import Trans from 'components/Trans'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useDomainNameForAddress } from 'hooks/useDomain'
import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useAccount } from 'wagmi'
import ClaimYourNFT from './ClaimYourNFT'
import ProfileUserMenuItem from './ProfileUserMenuItem'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()
  const { address: account } = useAccount()
  const { hasPendingTransactions } = usePendingTransactions()
  const { isInitialized, isLoading, profile } = useProfile()
  const { shouldShowModal } = useAirdropModalStatus()

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  const hasProfile = isInitialized && !!profile

  const onClickWalletMenu = useCallback((): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }, [isWrongNetwork, onPresentWalletModal, onPresentWrongNetworkModal])

  return (
    <>
      <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
      <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
        {t('Recent Transactions')}
        {hasPendingTransactions && <RefreshIcon spin />}
      </UserMenuItem>
      <UserMenuDivider />
      <NextLink href={`/profile/${account?.toLowerCase()}`} passHref>
        <UserMenuItem disabled={isWrongNetwork || chainId !== ChainId.BSC}>{t('Your NFTs')}</UserMenuItem>
      </NextLink>
      {shouldShowModal && <ClaimYourNFT />}
      <ProfileUserMenuItem
        isLoading={isLoading}
        hasProfile={hasProfile}
        disabled={isWrongNetwork || chainId !== ChainId.BSC}
      />
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { domainName, avatar } = useDomainNameForAddress(account)
  const { isWrongNetwork } = useActiveChainId()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { profile } = useProfile()
  const avatarSrc = avatar // CometSwap: 简化头像处理，直接使用默认头像
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  if (account) {
    return (
      <UIKitUserMenu
        account={domainName || account}
        ellipsis={!domainName}
        avatarSrc={avatarSrc}
        text={userMenuText}
        variant={userMenuVariable}
      >
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <>
      {/* CometSwap: 桌面端显示完整的Connect Wallet按钮 */}
      <Box display={['none', null, null, 'block']}>
        <ConnectWalletButton scale="sm">
          <Trans>Connect Wallet</Trans>
        </ConnectWalletButton>
      </Box>
      {/* CometSwap: 移动端显示紧凑的开关样式按钮 - 只显示图标 */}
      <Box display={['block', null, null, 'none']}>
        <ConnectWalletButton 
          scale="xs" 
          variant="secondary"
          style={{ 
            minWidth: '36px',
            width: '36px', 
            height: '36px',
            padding: '0',
            borderRadius: '8px', // CometSwap: 使用更新的圆角�?            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* CometSwap: 移动端只显示钱包图标，无文字 */}
          <WalletFilledV2Icon color="invertedContrast" width="20px" height="20px" />
        </ConnectWalletButton>
      </Box>
    </>
  )
}

export default UserMenu

