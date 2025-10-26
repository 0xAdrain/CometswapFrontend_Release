import { useTranslation } from '@cometswap/localization'
import { Box, Link } from '@cometswap/uikit'
import { VerticalDivider } from '@cometswap/widgets-internal'
import { TextHighlight } from './TextHighlight'

export const SolvStrip = () => {
  const { t } = useTranslation()

  return (
    <Box mr={['6px']}>
      <TextHighlight
        text={t('Join the %token% Token Launch (IFO) on BNB Chain CometSwap', {
          token: 'SOLV',
        })}
        highlights={['SOLV', 'CometSwap']}
      />{' '}
      <Link
        external
        display="inline !important"
        fontSize={['12px', '12px', '14px']}
        href="https://cometswap.finance/ifo"
      >
        {t('Join Now')}
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
        fontSize={['12px', '12px', '14px']}
        href="https://forum.cometswap.finance/t/solv-ifo-discussion-thread/993"
      >
        {t('Learn More')}
      </Link>
    </Box>
  )
}

