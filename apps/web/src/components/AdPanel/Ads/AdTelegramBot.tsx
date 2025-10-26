import { useTranslation } from '@cometswap/localization'
import { TelegramIcon } from '@cometswap/uikit'
import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { AdPlayerProps } from '../types'
import { getImageUrl } from '../utils'

const actionLink = 'https://t.me/cometfi_bot'

export const AdTelegramBot = (props: AdPlayerProps) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={getImageUrl('prediction_telegram_bot')} {...props}>
      <BodyText>{t('CometSwap Prediction Telegram Bot is now live!')}</BodyText>

      <AdButton mt="4px" href={actionLink} endIcon={<TelegramIcon color="invertedContrast" />} isExternalLink>
        {t('Play Now')}
      </AdButton>
    </AdCard>
  )
}

