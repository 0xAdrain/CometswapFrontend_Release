import { useMemo } from 'react'
import { useTranslation } from '@cometswap/localization'
import { Flex, Box, Text, Balance } from '@cometswap/uikit'
import { useCometPrice } from 'hooks/useCometPrice'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import { PotteryWithdrawAbleData } from 'state/types'
import WithdrawButton from 'views/Pottery/components/Pot/Claim/WithdrawButton'
import { calculateCometAmount } from 'views/Pottery/helpers'
import { getDrawnDate } from 'views/Lottery/helpers'
import dayjs from 'dayjs'

interface AvailableWithdrawProps {
  withdrawData: PotteryWithdrawAbleData
}

const AvailableWithdraw: React.FC<React.PropsWithChildren<AvailableWithdrawProps>> = ({ withdrawData }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cometPrice = useCometPrice()
  const { previewRedeem, lockedDate, shares, status, potteryVaultAddress, totalSupply, totalLockComet, balanceOf } =
    withdrawData

  const cakeNumber = useMemo(() => new BigNumber(previewRedeem), [previewRedeem])
  const amountAsBn = calculateCometAmount({
    status,
    previewRedeem,
    shares,
    totalSupply: new BigNumber(totalSupply),
    totalLockComet: new BigNumber(totalLockComet),
  })

  const amount = getBalanceNumber(amountAsBn)
  const amountInBusd = new BigNumber(amount).times(cometPrice).toNumber()

  const lockDate = useMemo(() => getDrawnDate(locale, lockedDate?.toString()), [lockedDate, locale])
  const withdrawableDate = dayjs.unix(parseInt(lockedDate, 10)).add(70, 'days').unix()
  const withdrawableDateStr = useMemo(
    () => getDrawnDate(locale, withdrawableDate.toString()),
    [withdrawableDate, locale],
  )

  return (
    <Box>
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('stake withdrawal')}
      </Text>
      <Flex mb="11px">
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={amount} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={amountInBusd} decimals={2} unit=" USD" />
          {lockedDate && (
            <>
              <Text fontSize="10px" lineHeight="110%" color="textSubtle">
                {t('Deposited %date%', { date: lockDate })}
              </Text>
              <Text fontSize="10px" lineHeight="110%" color="textSubtle">
                {t('Withdrawable on %date%', { date: withdrawableDateStr })}
              </Text>
            </>
          )}
        </Box>
        <WithdrawButton
          status={status}
          cakeNumber={cakeNumber}
          redeemShare={shares}
          potteryVaultAddress={potteryVaultAddress}
          balanceOf={balanceOf}
        />
      </Flex>
    </Box>
  )
}

export default AvailableWithdraw

