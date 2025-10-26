import { useTranslation } from '@cometswap/localization'
import { AutoRow, Box, Text, TooltipText, useMatchBreakpoints } from '@cometswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { WEEK } from 'config/constants/Comet'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { useLockCometData } from 'state/Comet/hooks'
import styled from 'styled-components'
import { useProxyCometBalance } from 'views/CometStaking/hooks/useProxyCometBalance'
import { useTargetUnlockTime } from 'views/CometStaking/hooks/useTargetUnlockTime'
import { useVeCometAmount } from 'views/CometStaking/hooks/useVeCometAmount'
import { MyCometCard } from '../MyCometCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'
import { TotalApy } from './TotalApy'
import { formatDate } from './format'

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

interface NewStakingDataSetProps {
  cakeAmount?: number
  customCometCard?: JSX.Element
  customDataRow?: JSX.Element
}

export const NewStakingDataSet: React.FC<React.PropsWithChildren<NewStakingDataSetProps>> = ({
  cakeAmount = 0,
  customCometCard,
  customDataRow,
}) => {
  const { t } = useTranslation()
  const { cometLockWeeks } = useLockCometData()
  const { isDesktop } = useMatchBreakpoints()

  const unlockTimestamp = useTargetUnlockTime(Number(cometLockWeeks) * WEEK)
  const cakeAmountBN = useMemo(() => getDecimalAmount(new BN(cakeAmount)).toString(), [cakeAmount])
  const vecometAmountFromNative = useVeCometAmount(cakeAmountBN, unlockTimestamp)
  const { balance: proxyCometBalance } = useProxyCometBalance()
  const vecometAmount = useMemo(
    () => proxyCometBalance.plus(vecometAmountFromNative),
    [proxyCometBalance, vecometAmountFromNative],
  )

  const Comet = vecometAmount ? getFullDisplayBalance(new BN(vecometAmount), 18, 3) : '0'
  const factor =
    vecometAmountFromNative && vecometAmountFromNative
      ? `${new BN(vecometAmountFromNative).div(cakeAmountBN).toPrecision(2)}x`
      : '0x'
  const unlockOn = useMemo(() => formatDate(dayjs.unix(Number(unlockTimestamp))), [unlockTimestamp])

  return (
    <>
      <Text fontSize={12} bold color={isDesktop ? 'textSubtle' : undefined} textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <Box padding={['16px 0', '16px 0', 12]}>
        {customCometCard ?? <MyCometCard type="row" value={Comet} />}
        <AutoRow px={['0px', '0px', '16px']} py={['16px', '16px', '12px']} gap="8px">
          {customDataRow}
          <TotalApy Comet={Comet} cakeAmount={cakeAmount} cometLockWeeks={cometLockWeeks} />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle" textTransform="uppercase">
                {t('COMETto be locked')}
              </Text>
            }
            value={<ValueText>{cakeAmount}</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'The ratio factor between the amount of COMETlocked and the final veCOMETnumber. Extend your lock duration for a higher ratio factor.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Factor')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{factor}</ValueText>}
          />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('Duration')}
              </Text>
            }
            value={<ValueText>{cometLockWeeks} weeks</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'Once locked, your COMETwill be staked in veCOMETcontract until this date. Early withdrawal is not available.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Unlock on')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{unlockOn}</ValueText>}
          />
        </AutoRow>
      </Box>
    </>
  )
}

