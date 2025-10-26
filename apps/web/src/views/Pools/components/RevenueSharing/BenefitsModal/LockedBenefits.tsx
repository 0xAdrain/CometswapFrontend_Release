import { useTranslation } from '@cometswap/localization'
import { BCometIcon, Box, Card, Flex, ICometIcon, Text, VCometIcon } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'
import { useMemo } from 'react'

import BigNumber from 'bignumber.js'
import useVeCometBenefits from 'components/Menu/UserMenu/hooks/useVeCometBenefits'
import { useVaultApy } from 'hooks/useVaultApy'
import Image from 'next/image'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCometVault, VaultKey } from 'state/types'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'
import BenefitsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsText'

const LockedBenefits = () => {
  const { t } = useTranslation()
  const { data: cakeBenefits } = useVeCometBenefits()
  const { getLockedApy, getBoostFactor } = useVaultApy()
  const { userData } = useVaultPoolByKey(VaultKey.CometVault) as DeserializedLockedCometVault
  const { secondDuration } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime ?? '0',
    lockEndTime: userData?.lockEndTime ?? '0',
  })

  const lockedApy = useMemo(() => getLockedApy(secondDuration), [getLockedApy, secondDuration])
  const boostFactor = useMemo(() => getBoostFactor(secondDuration), [getBoostFactor, secondDuration])
  const delApy = useMemo(() => new BigNumber(lockedApy || 0).div(boostFactor).toNumber(), [lockedApy, boostFactor])

  const iCometTooltipComponent = () => (
    <>
      <Text>
        {t('iCOMETallows you to participate in the IFO public sales and commit up to %iComet% amount of COMET.', {
          iComet: cakeBenefits?.iComet,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const bCometTooltipComponent = () => (
    <>
      <Text>{t('bCOMETallows you to boost your yield in CometSwap Farms by up to 2x.')}</Text>
      <NextLinkFromReactRouter to="/liquidity/pools">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const vCometTooltipComponent = () => (
    <>
      <Text>
        {t('vCOMETboosts your voting power to %totalScore% in the CometSwap voting governance.', {
          totalScore: cakeBenefits?.vComet?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  return (
    <Box position="relative">
      <Box position="absolute" right="20px" top="-55px" zIndex={1}>
        <Image width={73} height={84} alt="lockCOMETbenefit" src="/images/pool/lockCOMETbenefit.png" />
      </Box>
      <Card mb="24px">
        <Box padding={16}>
          <Text fontSize={12} bold color="secondary" textTransform="uppercase">
            {t('locked benefits')}
          </Text>
          <Box mt="8px">
            <Flex mt="8px" flexDirection="row" alignItems="center">
              <Text color="textSubtle" fontSize="14px" mr="auto">
                {t('COMETYield')}
              </Text>
              <Text style={{ display: 'inline-block' }} color="success" bold>
                {`${Number(lockedApy).toFixed(2)}%`}
              </Text>
              <Text ml="2px" as="del" bold>{`${Number(delApy).toFixed(2)}%`}</Text>
            </Flex>
            <BenefitsText
              title="iCOMET"
              value={cakeBenefits?.iComet || ''}
              tooltipComponent={iCometTooltipComponent()}
              icon={<ICometIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="bCOMET"
              value={t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
              tooltipComponent={bCometTooltipComponent()}
              icon={<BCometIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="vCOMET"
              value={cakeBenefits?.vComet?.vaultScore || ''}
              tooltipComponent={vCometTooltipComponent()}
              icon={<VCometIcon width={24} height={24} mr="8px" />}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LockedBenefits

