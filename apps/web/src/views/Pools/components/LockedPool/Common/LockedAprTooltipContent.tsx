import { useTranslation } from '@cometswap/localization'

export default function LockedAprTooltipContent() {
  const { t } = useTranslation()
  return <>{t('To continue receiving COMETrewards, please migrate your Fixed-Term Staking COMETBalance to veCOMET')}</>
}

