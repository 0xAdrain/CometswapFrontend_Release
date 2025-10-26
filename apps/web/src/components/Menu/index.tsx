import { languageList, useTranslation } from '@cometswap/localization'
import { Text, Menu as UikitMenu, footerLinks, useModal, Box, useMatchBreakpoints } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePerpUrl } from 'hooks/usePerpUrl'
import useTheme from 'hooks/useTheme'
import { IdType, useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { useWebNotifications } from 'hooks/useWebNotifications'
import { useRouter } from 'next/router'
import { Suspense, lazy, useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { getOptionsUrl } from 'utils/getOptionsUrl'
import GlobalSettings from './GlobalSettings'
import { SettingsMode } from './GlobalSettings/types'
import UserMenu from './UserMenu'
import MobileMoreButton from './MobileMoreButton'
import { UseMenuItemsParams, useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuChildItem, getActiveSubMenuItem } from './utils'

const Notifications = lazy(() => import('views/Notifications'))

const LinkComponent = (linkProps) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const Menu = (props) => {
  const { enabled } = useWebNotifications()
  const { chainId } = useActiveChainId()
  const { isDark, setTheme } = useTheme()
  // const cometPrice = useCometPrice() // CometSwap: 移除COMET价格显示
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const { isMobile } = useMatchBreakpoints()
  const perpUrl = usePerpUrl({ chainId, isDark, languageCode: currentLanguage.code })
  const [perpConfirmed] = useUserNotUsCitizenAcknowledgement(IdType.PERPETUALS)
  const [optionsConfirmed] = useUserNotUsCitizenAcknowledgement(IdType.OPTIONS)

  const [onPerpConfirmModalPresent] = useModal(
    <USCitizenConfirmModal title={t('CometSwap Perpetuals')} id={IdType.PERPETUALS} href={perpUrl} />,
    true,
    false,
    'perpConfirmModal',
  )
  const [onOptionsConfirmModalPresent] = useModal(
    <USCitizenConfirmModal
      title={t('CometSwap Options')}
      id={IdType.OPTIONS}
      href={getOptionsUrl()}
      desc={
        <Text mt="0.5rem">
          {t(
            'Please note that you are being redirected to an externally hosted website associated with our partner Stryke (formerly Dopex).',
          )}
        </Text>
      }
    />,
    true,
    false,
    'optionsConfirmModal',
  )
  const onSubMenuClick = useCallback<NonNullable<UseMenuItemsParams['onClick']>>(
    (e, item) => {
      const preventRedirect = () => {
        e.preventDefault()
        e.stopPropagation()
      }
      if (item.confirmModalId === 'perpConfirmModal' && !perpConfirmed) {
        preventRedirect()
        onPerpConfirmModalPresent()
        return
      }
      if (item.confirmModalId === 'optionsConfirmModal' && !optionsConfirmed) {
        preventRedirect()
        onOptionsConfirmModalPresent()
      }
    },
    [perpConfirmed, optionsConfirmed, onPerpConfirmModalPresent, onOptionsConfirmModalPresent],
  )

  const menuItems = useMenuItems({
    onClick: onSubMenuClick,
  })

  const activeMenuItem = useMemo(() => getActiveMenuItem({ menuConfig: menuItems, pathname }), [menuItems, pathname])
  const activeSubMenuItem = useMemo(
    () => getActiveSubMenuItem({ menuItem: activeMenuItem, pathname }),
    [pathname, activeMenuItem],
  )
  const activeSubChildMenuItem = useMemo(
    () => getActiveSubMenuChildItem({ menuItem: activeMenuItem, pathname }),
    [activeMenuItem, pathname],
  )

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <UikitMenu
      linkComponent={LinkComponent}
      rightSide={
        <>
          {/* CometSwap: 桌面端显示所有按钮 */}
          <Box display={['none', null, null, 'block']}>
            <GlobalSettings mode={SettingsMode.GLOBAL} />
          </Box>
          {enabled && (
            <Box display={['none', null, null, 'block']}>
              <Suspense fallback={null}>
                <Notifications />
              </Suspense>
            </Box>
          )}
          <Box display={['none', null, null, 'block']}>
            <NetworkSwitcher />
          </Box>
          <UserMenu />
          {/* CometSwap: 移动端只显示更多按钮，替代其他按钮 */}
          <Box display={['block', null, null, 'none']}>
            <MobileMoreButton />
          </Box>
        </>
      }
      chainId={chainId}
      banner={undefined}
      isDark={isDark}
      toggleTheme={toggleTheme}
      // CometSwap: 移动端隐藏语言选择器，桌面端显示
      currentLang={isMobile ? '' : currentLanguage.code}
      langs={isMobile ? [] : languageList}
      setLang={isMobile ? undefined : setLanguage}
      // cometPriceUsd={cometPrice.eq(BIG_ZERO) ? undefined : cometPrice} // CometSwap: 移除COMET价格显示
      links={menuItems}
      subLinks={
        activeSubMenuItem?.overrideSubNavItems ??
        activeMenuItem?.overrideSubNavItems ??
        (activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav
          ? []
          : activeSubMenuItem?.items ?? activeMenuItem?.items)
      }
      footerLinks={getFooterLinks}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      activeSubItemChildItem={activeSubChildMenuItem?.href}
      buyCometLabel="" // CometSwap: 移除Buy COMET按钮 - 传递空字符�?      buyCometLink="" // CometSwap: 移除Buy COMET按钮 - 传递空字符�?      {...props}
    />
  )
}

export default Menu

const SharedComponentWithOutMenuWrapper = styled.div`
  display: none;
`

export const SharedComponentWithOutMenu: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { enabled } = useWebNotifications()
  return (
    <>
      <SharedComponentWithOutMenuWrapper>
        <GlobalSettings mode={SettingsMode.GLOBAL} />
        {enabled && (
          <Suspense fallback={null}>
            <Notifications />
          </Suspense>
        )}
        <NetworkSwitcher />
        <UserMenu />
      </SharedComponentWithOutMenuWrapper>
      {children}
    </>
  )
}

