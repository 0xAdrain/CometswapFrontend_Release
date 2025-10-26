import { useTranslation } from '@cometswap/localization'
import { ArrowForwardIcon, Box, Link, Text } from '@cometswap/uikit'
import { VerticalDivider } from '@cometswap/widgets-internal'

export const Step3 = () => {
  const { t } = useTranslation()

  return (
    <Box mr={['6px']}>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('Enjoy')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        {t('Zero')}
      </Text>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('trading and gas fees on Ethereum and Arbitrum with')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        CometSwapX
      </Text>
      <Link
        external
        display="inline-flex !important"
        verticalAlign="baseline"
        showExternalIcon
        fontSize={['12px', '12px', '14px']}
        href="https://cometswap.finance/swap?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      >
        {t('Swap Now')}
        <ArrowForwardIcon
          style={{
            fill: '#53DEE9',
          }}
        />
      </Link>
      <VerticalDivider
        bg="#53DEE9"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '18px',
          opacity: 0.4,
          width: '1px',
          marginLeft: '0px',
          marginRight: '8px',
        }}
      />
      <Link
        external
        display="inline !important"
        showExternalIcon
        fontSize={['12px', '12px', '14px']}
        href="https://blog.cometswap.finance/articles/introducing-comet-swap-x-zero-fee-and-gasless-swaps-on-ethereum-and-arbitrum?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      >
        {t('Learn More')}
      </Link>
    </Box>
  )
}

