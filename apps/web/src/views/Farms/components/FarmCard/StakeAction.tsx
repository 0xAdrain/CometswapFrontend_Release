import { ChainId } from '@cometswap/chains'
import { FarmWithStakedValue } from '@cometswap/farms'
import { useTranslation } from '@cometswap/localization'
import { NATIVE, WNATIVE } from '@cometswap/sdk'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal, useToast } from '@cometswap/uikit'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { formatLpBalance } from '@cometswap/utils/formatBalance'
import { FarmWidget } from '@cometswap/widgets-internal'
import BigNumber from 'bignumber.js'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCometPrice } from 'hooks/useCometPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { pickFarmTransactionTx } from 'state/global/actions'
import { useTransactionAdder } from 'state/transactions/hooks'
import { styled } from 'styled-components'
import { logGTMClickStakeFarmConfirmEvent, logGTMStakeFarmTxSentEvent } from 'utils/customGTMEventTracking'
import { useIsBloctoETH } from 'views/Farms'
import { useBCometBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCometV3/useBCometV3Info'
// Cross-chain farming hook removed
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import { YieldBoosterState } from '../YieldBooster/hooks/useYieldBoosterState'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
  onStake: <SendTransactionResult>(value: string) => Promise<SendTransactionResult>
  onUnstake: <SendTransactionResult>(value: string) => Promise<SendTransactionResult>
  onDone: () => void
  onApprove: <SendTransactionResult>() => Promise<SendTransactionResult>
  isApproved: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  vaultPid,
  quoteToken,
  token,
  lpSymbol,
  lpTokenPrice,
  multiplier,
  apr,
  lpAddress,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  bCometUserData,
  bCometPublicData,
  bCometWrapperAddress,
  lpRewardsApr,
  onStake,
  onUnstake,
  onDone,
  onApprove,
  isApproved,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const { account, chainId } = useAccountActiveChain()
  const native = useNativeCurrency()
  const isBooster = Boolean(bCometWrapperAddress)
  const { tokenBalance, stakedBalance, allowance } = (isBooster ? bCometUserData : userData) || {}
  const cometPrice = useCometPrice()
  const router = useRouter()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()
  const { boosterState } = useContext(YieldBoosterStateContext)
  // Cross-chain farming removed
  const isBloctoETH = useIsBloctoETH()
  const isBoosterAndRewardInRange = isBooster && bCometPublicData?.isRewardInRange
  const { locked } = useBCometBoostLimitAndLockInfo()

  // Cross-chain warning removed

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item))
  }, [router])

  const handleStake = async (amount: string) => {
    logGTMClickStakeFarmConfirmEvent()
    // Cross-chain staking removed - always use direct staking
    const receipt = await fetchWithCatchTxError(() => onStake(amount))
    if (receipt?.status) {
      logGTMStakeFarmTxSentEvent()
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  // Cross-chain staking function removed

  const handleUnstake = async (amount: string) => {
    // Cross-chain unstaking removed - always use direct unstaking
    const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  // Cross-chain unstaking function removed

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  // const bCometCalculatorSlot = (calculatorBalance) => (
  //   <BCometCalculator
  //     targetInputBalance={calculatorBalance}
  //     earningTokenPrice={cometPrice.toNumber()}
  //     lpTokenStakedAmount={lpTokenStakedAmount ?? BIG_ZERO}
  //     setBCometMultiplier={setBCometMultiplier}
  //   />
  // )

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
      max={tokenBalance ?? BIG_ZERO}
      stakedBalance={stakedBalance ?? BIG_ZERO}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cometPrice={cometPrice}
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      bCometMultiplier={null}
      // Cross-chain warning removed
      decimals={18}
      allowance={allowance}
      enablePendingTx={pendingTx}
      lpRewardsApr={lpRewardsApr}
      onConfirm={handleStake}
      handleApprove={handleApprove}
      isBooster={isBoosterAndRewardInRange}
      boosterMultiplier={
        isBoosterAndRewardInRange
          ? bCometUserData?.boosterMultiplier === 0 || bCometUserData?.stakedBalance.eq(0) || !locked
            ? 2.5
            : bCometUserData?.boosterMultiplier
          : 1
      }
      // bCometCalculatorSlot={bCometCalculatorSlot}
    />,
    true,
    true,
    `farm-deposit-modal-${pid}`,
  )

  const [onPresentWithdraw] = useModal(
    <FarmWidget.WithdrawModal
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      max={stakedBalance ?? BIG_ZERO}
      onConfirm={handleUnstake}
      lpPrice={lpTokenPrice}
      tokenName={lpSymbol}
      // Cross-chain warning removed
      decimals={18}
    />,
  )

  const renderStakingButtons = () => {
    return stakedBalance?.eq(0) ? (
      <Button onClick={onPresentDeposit} disabled={isStakeReady}>
        {t('Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton mr="6px" variant="secondary" disabled={pendingFarm.length > 0} onClick={onPresentWithdraw}>
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton variant="secondary" onClick={onPresentDeposit} disabled={isStakeReady || isBloctoETH}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  const onClickLoadingIcon = () => {
    const { length } = pendingFarm
    if (length) {
      if (length > 1) {
        onPresentTransactionModal()
      } else if (pendingFarm[0].txid) {
        dispatch(pickFarmTransactionTx({ tx: pendingFarm[0].txid, chainId: chainId! }))
      }
    }
  }

  // TODO: Move this out to prevent unnecessary re-rendered
  if (!isApproved && stakedBalance?.eq(0)) {
    return (
      <Button mt="8px" width="100%" disabled={pendingTx || isBloctoETH} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Flex justifyContent="space-between" width="100%" alignItems="center">
      <FarmWidget.StakedLP
        decimals={18}
        stakedBalance={stakedBalance ?? BIG_ZERO}
        quoteTokenSymbol={
          chainId && WNATIVE[chainId]?.symbol === quoteToken.symbol ? NATIVE[chainId]?.symbol : quoteToken.symbol
        }
        tokenSymbol={chainId && WNATIVE[chainId]?.symbol === token.symbol ? NATIVE[chainId]?.symbol : token.symbol}
        lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
        lpTokenPrice={lpTokenPrice ?? BIG_ZERO}
        tokenAmountTotal={tokenAmountTotal ?? BIG_ZERO}
        quoteTokenAmountTotal={quoteTokenAmountTotal ?? BIG_ZERO}
        pendingFarmLength={pendingFarm.length}
        onClickLoadingIcon={onClickLoadingIcon}
      />
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction

