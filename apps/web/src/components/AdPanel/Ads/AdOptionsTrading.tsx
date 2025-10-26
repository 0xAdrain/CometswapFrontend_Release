import { useTranslation } from '@cometswap/localization'
import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { AdPlayerProps } from '../types'
import { getImageUrl } from '../utils'

const learnMoreLink =
  'https://blog.cometswap.finance/articles/introducing-clamm-options-trading-on-comet-swap-in-collaboration-with-stryke-formerly-dopex'

const actionLink = 'https://cometswap.stryke.xyz'

export const AdOptionsTrading = (props: AdPlayerProps) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={getImageUrl('clamm_options_trading')} {...props}>
      <BodyText mb="0">{t('Introducing CLAMM Options Trading.')}</BodyText>

      <AdButton variant="text" href={learnMoreLink} isExternalLink>
        {t('Learn More')}
      </AdButton>

      <AdButton mt="4px" href={actionLink} chevronRightIcon isExternalLink>
        {t('Try it now')}
      </AdButton>
    </AdCard>
  )
}

