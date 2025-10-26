import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { COMET} from '@cometswap/tokens'
import { Flex, FlexGap, Text, TokenImage } from '@cometswap/uikit'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { ApproveAndLockStatus } from 'state/Comet/atoms'
import { useRoundedUnlockTimestamp } from 'views/CometStaking/hooks/useRoundedUnlockTimestamp'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'

type LockInfoProps = {
  amount: string
  week: string | number
  status: ApproveAndLockStatus
}

export const LockInfo: React.FC<LockInfoProps> = ({ amount, status }) => {
  const { cakeUnlockTime, nativecometLockedAmount, cometLockExpired } = useVeCometLockStatus()

  const txAmount = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_WEEKS, ApproveAndLockStatus.INCREASE_WEEKS_PENDING].includes(status)) {
      return getBalanceNumber(new BN(nativecometLockedAmount.toString()))
    }
    return amount
  }, [status, nativecometLockedAmount, amount])

  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(cometLockExpired ? undefined : Number(cakeUnlockTime))

  const txUnlock = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_AMOUNT, ApproveAndLockStatus.INCREASE_AMOUNT_PENDING].includes(status)) {
      return cakeUnlockTime
    }

    return Number(roundedUnlockTimestamp)
  }, [status, roundedUnlockTimestamp, cakeUnlockTime])

  const { t } = useTranslation()
  return (
    <FlexGap flexDirection="column" gap="4px" mt="4px" width="100%" alignItems="center" justifyContent="center">
      <Flex alignItems="center" width="100%" justifyContent="center">
        <TokenImage
          src={`https://cometswap.finance/images/tokens/${COMET[ChainId.BSC].address}.png`}
          height={20}
          width={20}
          mr="4px"
          title={COMET[ChainId.BSC].symbol}
        />
        <Text fontSize="14px">{`${txAmount} COMET`}</Text>
      </Flex>

      <Text fontSize={12} color="textSubtle">
        {t('to be locked until')}
      </Text>

      <Text fontSize="14px">{dayjs.unix(txUnlock).format('DD MMM YYYY')}</Text>
    </FlexGap>
  )
}

