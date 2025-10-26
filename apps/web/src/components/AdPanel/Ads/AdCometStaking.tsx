import { useTranslation } from '@cometswap/localization'
import { useFourYearTotalCometApr } from 'views/CometStaking/hooks/useAPR'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { BodyText } from '../BodyText'
import { AdPlayerProps } from '../types'
import { getImageUrl } from '../utils'

const actionLink = 'https://docs.cometswap.finance/products/veComet'

export const AdveCometStaking = (props: AdPlayerProps) => {
  const { t } = useTranslation()
  const { totalApr } = useFourYearTotalCometApr()

  return (
    <AdCard imageUrl={getImageUrl('cake_staking')} {...props}>
      <BodyText mb="0">
        {t('Stake COMETand Earn up to %apr%% APR !', {
          apr: totalApr.toFixed(2),
        })}
      </BodyText>

      <AdButton variant="text" href={actionLink} isExternalLink>
        {t('Learn More')}
      </AdButton>

      <AdButton mt="4px" href="/comet-staking" chevronRightIcon>
        {t('Stake COMET')}
      </AdButton>
    </AdCard>
  )
}

