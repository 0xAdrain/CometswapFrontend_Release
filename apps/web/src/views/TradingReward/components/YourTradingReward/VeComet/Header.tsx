import { useTranslation } from '@cometswap/localization'
import { Box, Flex, Image, Link, Text, TooltipText, useTooltip } from '@cometswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'

export const Header = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t('The estimated veCOMET amount at the snapshot time is based on veCOMET’s linearly decreasing math.')}
      </Text>
      <Link
        external
        href="https://docs.cometswap.finance/products/trading-reward/faq#what-is-vecomet-at-snapshot-time"
      >
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex flexDirection={['column']} alignItems="center" mb={['24px']}>
      <Image
        width={62}
        height={62}
        alt="trading-reward-vecomet"
        src={`${ASSET_CDN}/web/vecomet/token-vecomet-with-time.png`}
      />
      <Text textAlign="center" lineHeight="120%" m="24px 0 4px 0">
        {t('To earn trading reward, there is a minimum requirement of your')}
      </Text>
      <TooltipText ref={targetRef} bold textAlign="center">
        {t('veCOMET at snapshot time.')}
      </TooltipText>
      {tooltipVisible && tooltip}
    </Flex>
  )
}
