import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HelpIcon,
  Link,
  RocketIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@cometswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CrossChainCometModal } from 'components/CrossChainCometModal'
import { SwitchToBnbChainModal } from 'components/CrossChainCometModal/components/SwitchToBnbCahinModal'
import { useMultichainCometWellSynced } from 'components/CrossChainCometModal/hooks/useMultichainCometWellSynced'
import Image from 'next/legacy/image'
import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { useAccount } from 'wagmi'
import boosterCardImage from '../../../../images/boosterCardImage.png'
import boosterCardImagePM from '../../../../images/boosterCardImagePM.png'
import { useBCometBoostLimitAndLockInfo } from '../../hooks/bCometV3/useBCometV3Info'

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  transform: translateY(-50%) scale(75%);
  right: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    transform: translateY(-50%);
  }
  z-index: 2;
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
  padding: 8px 24px 16px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: calc(100% - 48px);
    top: 0px;
    left: 24px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

export const useBCometTooltipContent = () => {
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Box mb="20px">
        {t(
          'Yield Boosters allow you to boost your farming yields by locking COMETin the veCOMETpool. The more COMETyou lock, and the longer you lock them, the higher the boost you will receive.',
        )}
      </Box>
      <Box>
        {t('To learn more, check out the')}
        <Link external href="https://medium.com/cometswap/introducing-bcomet-farm-yield-boosters-b27b7a6f0f84">
          {t('Medium Article')}
        </Link>
      </Box>
    </>
  )
  return tooltipContent
}

export const BCometBoosterCard: React.FC<{ variants?: 'farm' | 'pm' }> = ({ variants = 'farm' }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const tooltipContent = useBCometTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  return (
    <CardWrapper>
      <ImageWrapper style={{ left: variants === 'pm' ? -185 : isMobile ? -65 : -70, top: 105 }}>
        <Image
          src={variants === 'pm' ? boosterCardImagePM : boosterCardImage}
          alt="booster-card-image"
          width={variants === 'pm' ? 259 : 99}
          height={variants === 'pm' ? 226 : 191}
          placeholder="blur"
        />
      </ImageWrapper>
      <Card p="0px" style={{ zIndex: 1 }}>
        <StyledCardBody style={{ padding: '15px 24px' }}>
          <RocketIcon />
          <Text fontSize={22} bold color="text" marginBottom="-12px" display="inline-block" ml="7px">
            {t('Yield Booster')}
          </Text>
          {tooltipVisible && tooltip}
          <Box ref={targetRef} style={{ float: 'right', position: 'relative', top: '6px' }}>
            <HelpIcon color={theme.colors.textSubtle} />
          </Box>
        </StyledCardBody>
        <StyledCardFooter>
          <CardContent variants={variants} />
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

const CardContent: React.FC<{ variants?: 'farm' | 'pm' }> = ({ variants }) => {
  const { t } = useTranslation()
  const { address: account, chainId } = useAccount()
  const { locked } = useBCometBoostLimitAndLockInfo(ChainId.BSC)
  const { isCometWillSync } = useMultichainCometWellSynced(chainId ?? -1)
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const isBSC = useMemo(() => chainId === ChainId.BSC, [chainId])

  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veCOMETstaking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton width="100%" style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  if (!locked)
    return (
      <Box width="100%">
        <Text color="textSubtle" fontSize={12} bold>
          {t('No COMETlocked')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veCOMETstaking position is required for activating farm yield boosters.')}
        </Text>
        <NextLink href="/comet-staking" passHref>
          <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
            {t('Go to COMET Staking')}
          </Button>
        </NextLink>
      </Box>
    )

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Text color="secondary" fontSize={12} bold textTransform="uppercase">
          {isCometWillSync ? t('Yield booster active') : t('veCOMETNot Synced')}
        </Text>
      </Flex>
      <Text color="textSubtle" fontSize={12} mb="10px">
        {isBSC
          ? variants === 'pm'
            ? t(
                'Boost the token rewards from unlimited number of Position Managers. Boost will be applied when staking. Lock more COMETor extend your lock to receive a higher boost.',
              )
            : t(
                'Boost your COMETrewards from V3, V2 and StableSwap farms. Boost will be applied when staking. Lock more COMETor extend your lock to receive a higher boost.',
              )
          : isCometWillSync
          ? t('Boost unlimited number of positions on all V3 Farms. Boost will be applied when staking.')
          : t('You need to sync your veCOMETto the current network to activate farm yield boosters.')}
      </Text>
      {!isBSC && isCometWillSync && (
        <Text fontSize={12} mb="10px" color="textSubtle">
          {t(
            'You will need to re-sync your veCOMETafter extending or adding more COMETto your veCOMETstaking position.',
          )}
        </Text>
      )}
      <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }} onClick={() => setIsOpen(true)}>
        {t('Sync veCOMET')}
      </Button>
      {isBSC ? (
        <CrossChainCometModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onDismiss={() => {
            setIsOpen(false)
          }}
        />
      ) : (
        <SwitchToBnbChainModal isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      )}
    </Box>
  )
}

