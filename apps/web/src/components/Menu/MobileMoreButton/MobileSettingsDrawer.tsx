import { languageList, useTranslation } from '@cometswap/localization'
import {
  Box,
  Text,
  Button,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  LangSelector,
  Flex,
} from '@cometswap/uikit'
import { motion } from 'framer-motion' // CometSwap: 添加动画效果
import { styled } from 'styled-components'
import React, { Suspense, lazy } from 'react'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { useWebNotifications } from 'hooks/useWebNotifications'

const Notifications = lazy(() => import('views/Notifications'))

// CometSwap: 自定义Modal容器，苹果式底部抽屉
const MobileModalContainer = styled(ModalContainer)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: auto;
  max-width: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  min-height: 320px;
  max-height: 70vh;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  
  /* 苹果式动画 */
  animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

// CometSwap: 拖拽指示器
const DragIndicator = styled.div`
  width: 40px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.textSubtle};
  border-radius: 2px;
  margin: 12px auto 24px;
  opacity: 0.4;
`

// CometSwap: 横向功能卡片 - 添加动画效果
const HorizontalFeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px 16px;
  flex: 1;
  margin: 0 6px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 120px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`

// CometSwap: 大图标容器
const BigFeatureIcon = styled(Box)`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 28px;
`

// CometSwap: 功能标题
const FeatureTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.2;
`

// CometSwap: 组件展示区域
const ComponentShowcase = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: 16px;
  margin: 20px 12px 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

// CometSwap: 展示标题
const ShowcaseTitle = styled(Text)`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 12px;
  text-align: center;
`

const MobileSettingsDrawer: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const { t, currentLanguage, setLanguage } = useTranslation()
  const { enabled: notificationsEnabled } = useWebNotifications()

  return (
    <MobileModalContainer minHeight="auto">
      <DragIndicator />
      
      <ModalBody p="20px">
        {/* CometSwap: 横向功能卡片 - 添加动画效果 */}
        <Flex mb="8px">
          <HorizontalFeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <BigFeatureIcon>🌐</BigFeatureIcon>
            <FeatureTitle>{t('Network')}</FeatureTitle>
          </HorizontalFeatureCard>
          
          <HorizontalFeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <BigFeatureIcon>🌍</BigFeatureIcon>
            <FeatureTitle>{t('Language')}</FeatureTitle>
          </HorizontalFeatureCard>
          
          <HorizontalFeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <BigFeatureIcon>⚙️</BigFeatureIcon>
            <FeatureTitle>{t('Settings')}</FeatureTitle>
          </HorizontalFeatureCard>
        </Flex>

        {/* CometSwap: 网络切换器展示 */}
        <ComponentShowcase>
          <ShowcaseTitle>{t('Network & Chain')}</ShowcaseTitle>
          <NetworkSwitcher />
        </ComponentShowcase>

        {/* CometSwap: 语言选择器展示 */}
        <ComponentShowcase>
          <ShowcaseTitle>{t('Language Settings')}</ShowcaseTitle>
          <Flex justifyContent="center">
            <LangSelector
              currentLang={currentLanguage.code}
              langs={languageList}
              setLang={setLanguage}
              color="text"
              buttonScale="sm"
            />
          </Flex>
        </ComponentShowcase>

        {/* CometSwap: 全局设置展示 */}
        <ComponentShowcase>
          <ShowcaseTitle>{t('Trading Settings')}</ShowcaseTitle>
          <Flex justifyContent="center">
            <GlobalSettings mode={SettingsMode.GLOBAL} />
          </Flex>
        </ComponentShowcase>

        {/* CometSwap: 通知设置 */}
        {notificationsEnabled && (
          <ComponentShowcase>
            <ShowcaseTitle>{t('Notifications')}</ShowcaseTitle>
            <Suspense fallback={<Text textAlign="center">{t('Loading...')}</Text>}>
              <Notifications />
            </Suspense>
          </ComponentShowcase>
        )}

        {/* CometSwap: 关闭按钮 */}
        <Box mt="24px">
          <Button 
            variant="secondary" 
            width="100%" 
            onClick={onDismiss}
            style={{ 
              borderRadius: '16px',
              minHeight: '48px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {t('Close')}
          </Button>
        </Box>
      </ModalBody>
    </MobileModalContainer>
  )
}

export default MobileSettingsDrawer