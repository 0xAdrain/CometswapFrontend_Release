import { useTranslation } from '@cometswap/localization'
import { FlexGap, Text, TooltipText } from '@cometswap/uikit'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { WEEK } from 'config/constants/Comet'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLockCometData } from 'state/Comet/hooks'
import { useProxyCometBalance } from 'views/CometStaking/hooks/useProxyCometBalance'
import { useTargetUnlockTime } from 'views/CometStaking/hooks/useTargetUnlockTime'
import { useVeCometAmount } from 'views/CometStaking/hooks/useVeCometAmount'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

interface LockCometDataSetProps {
  hideLockWeeksDataSetStyle?: boolean
}

export const LockWeeksDataSet: React.FC<React.PropsWithChildren<LockCometDataSetProps>> = ({
  hideLockWeeksDataSetStyle,
}) => {
  const { t } = useTranslation()
  const { cometLockWeeks } = useLockCometData()
  const { cometLockExpired, cakeUnlockTime, nativecometLockedAmount } = useVeCometLockStatus()
  const { balance: proxyCometBalance } = useProxyCometBalance()
  const unlockTimestamp = useTargetUnlockTime(
    Number(cometLockWeeks) * WEEK,
    cometLockExpired ? undefined : Number(cakeUnlockTime),
  )
  const vecometAmountFromNative = useVeCometAmount(nativecometLockedAmount.toString(), unlockTimestamp)
  const vecometAmountFromNativeBN = useMemo(() => {
    return new BN(vecometAmountFromNative)
  }, [vecometAmountFromNative])

  const vecometAmountBN = useMemo(() => {
    return proxyCometBalance.plus(vecometAmountFromNativeBN)
  }, [vecometAmountFromNativeBN, proxyCometBalance])

  const factor =
    vecometAmountFromNativeBN && vecometAmountFromNativeBN.gt(0)
      ? `${vecometAmountFromNativeBN.div(nativecometLockedAmount.toString()).toPrecision(2)}x`
      : '0.00x'

  const newUnlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(unlockTimestamp)))
  }, [unlockTimestamp])

  return (
    <DataBox $hideStyle={hideLockWeeksDataSetStyle} mt="16px" gap="8px">
      <DataHeader value={getBalanceAmount(vecometAmountBN)} hideCometIcon={hideLockWeeksDataSetStyle} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'The ratio factor between the amount of COMETlocked and the final veCOMETnumber. Extend your lock duration for a higher ratio factor.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('factor')}
            </TooltipText>
          </Tooltips>
        }
        value={factor}
      />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your COMETwill be staked in veCOMETcontract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={cometLockExpired && !cometLockWeeks ? <ExpiredUnlockTime time={cakeUnlockTime!} /> : newUnlockTime}
      />
    </DataBox>
  )
}

const ExpiredUnlockTime: React.FC<{
  time: number
}> = ({ time }) => {
  const { t } = useTranslation()
  return (
    <FlexGap gap="2px" alignItems="baseline">
      <Text fontSize={12}>{formatDate(dayjs.unix(time))}</Text>
      <Text fontWeight={700} fontSize={16} color="#D67E0A">
        {t('Unlocked')}
      </Text>
    </FlexGap>
  )
}

