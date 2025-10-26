import BigNumber from 'bignumber.js'
import { useTranslation } from '@cometswap/localization'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughCometValidator = (cakeAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient COMETbalance')

  const userNotEnoughComet = useMemo(() => {
    if (new BigNumber(cakeAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [cakeAmount, stakingTokenBalance])
  return { userNotEnoughComet, notEnoughErrorMessage: errorMessage }
}

