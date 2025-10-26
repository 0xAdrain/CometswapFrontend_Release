import { useTranslation } from '@cometswap/localization'
import { TooltipText } from '@cometswap/uikit'
import { getBalanceAmount, getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useLockCometData } from 'state/Comet/hooks'
import { getVeCometAmount } from 'utils/getVeCometAmount'
import { useCurrentBlockTimestamp } from 'views/CometStaking/hooks/useCurrentBlockTimestamp'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

interface LockCometDataSetProps {
  hideLockCometDataSetStyle?: boolean
}

export const LockCometDataSet: React.FC<React.PropsWithChildren<LockCometDataSetProps>> = ({
  hideLockCometDataSetStyle,
}) => {
  const { t } = useTranslation()
  const { balance: vecometBalance } = useVeCometBalance()
  const { cakeUnlockTime, cometLockedAmount } = useVeCometLockStatus()
  const { cometLockAmount } = useLockCometData()
  const amountInputBN = useMemo(() => getDecimalAmount(new BN(cometLockAmount || 0)), [cometLockAmount])
  const amountLockedBN = useMemo(() => getBalanceAmount(new BN(cometLockedAmount.toString() || '0')), [cometLockedAmount])
  const amount = useMemo(() => {
    return getBalanceAmount(amountInputBN.plus(amountLockedBN))
  }, [amountInputBN, amountLockedBN])
  const currentTimestamp = useCurrentBlockTimestamp()
  const vecometAmount = useMemo(() => {
    return getBalanceAmount(vecometBalance).plus(getVeCometAmount(cometLockAmount, cakeUnlockTime - currentTimestamp))
  }, [cometLockAmount, cakeUnlockTime, currentTimestamp, vecometBalance])

  const unlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(cakeUnlockTime)))
  }, [cakeUnlockTime])

  return (
    <DataBox $hideStyle={hideLockCometDataSetStyle} gap="8px" mt="16px">
      <DataHeader value={vecometAmount} hideCometIcon={hideLockCometDataSetStyle} />
      <DataRow label={t('COMETto be locked')} value={amount.toFixed(2)} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your COMETwill be staked in veCOMETcontract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('Unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={unlockTime}
      />
    </DataBox>
  )
}

