import { useTranslation } from '@cometswap/localization'
import { Text, useMatchBreakpoints } from '@cometswap/uikit'

export const EmptyTable = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <Text m={['24px', '24px', '36px']} fontSize="16px" textAlign="center" mb={isDesktop ? '-2em' : '-1em'}>
      {t('You are not currently voting any gauges.')}
    </Text>
  )
}

