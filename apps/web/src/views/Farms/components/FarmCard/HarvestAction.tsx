import { useTranslation } from '@cometswap/localization'
import { Balance, Button, Flex, Heading, TooltipText, useModal, useToast, useTooltip } from '@cometswap/uikit'
import { FarmWidget } from '@cometswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { SerializedBCometUserData } from '@cometswap/farms'
import { Token } from '@cometswap/sdk'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import { useCometPrice } from 'hooks/useCometPrice'

interface FarmCardActionsProps {
  pid?: number
  token?: Token
  quoteToken?: Token
  earnings?: BigNumber
  vaultPid?: number
  proxyCometBalance?: number
  lpSymbol?: string
  onReward: <SendTransactionResult>() => Promise<SendTransactionResult>
  onDone?: () => void
  bCometWrapperAddress?: Address
  bCometUserData?: SerializedBComet
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  earnings = BIG_ZERO,
  proxyCometBalance,
  lpSymbol,
  onReward,
  onDone,
  bCometWrapperAddress,
  bCometUserData,
}) => {
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  const cometPrice = useCometPrice()
  const rawEarningsBalance = account
    ? bCometWrapperAddress
      ? getBalanceAmount(new BigNumber(bCometUserData?.earnings ?? '0'))
      : getBalanceAmount(earnings)
    : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cometPrice).toNumber() : 0
  const tooltipBalance = rawEarningsBalance.isGreaterThan(FarmWidget.FARMS_SMALL_AMOUNT_THRESHOLD)
    ? displayBalance
    : '< 0.00001'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${tooltipBalance} ${t(
      `COMEThas been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`,
    )}`,
    {
      placement: 'bottom',
    },
  )

  const onClickHarvestButton = () => {
    // Cross-chain harvest removed - always use direct harvest
    handleHarvest()
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'COMET' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  // Cross-chain harvest modal removed - single chain only

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center" width="100%">
      <Flex flexDirection="column" alignItems="flex-start">
        {proxyCometBalance ? (
          <>
            <TooltipText ref={targetRef} decorationColor="secondary">
              <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
            </TooltipText>
            {tooltipVisible && tooltip}
          </>
        ) : (
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        )}
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <Button disabled={rawEarningsBalance.eq(0) || pendingTx} onClick={onClickHarvestButton}>
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction

