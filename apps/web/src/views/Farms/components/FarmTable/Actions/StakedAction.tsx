import { ChainId } from '@cometswap/chains'
import { FarmWithStakedValue } from '@cometswap/farms'
import { useTranslation } from '@cometswap/localization'
import { NATIVE, WNATIVE } from '@cometswap/sdk'
import { Flex, Text, useModal, useToast } from '@cometswap/uikit'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { formatLpBalance } from '@cometswap/utils/formatBalance'
import { FarmWidget } from '@cometswap/widgets-internal'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL, DEFAULT_TOKEN_DECIMAL } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCometPrice } from 'hooks/useCometPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchBCometWrapperUserDataAsync, fetchFarmUserDataAsync } from 'state/farms'
// Cross-chain farm functionality removed

import { useTransactionAdder } from 'state/transactions/hooks'
import { FarmTransactionStatus, pickFarmTransactionTx } from 'state/transactions/actions'
import { styled } from 'styled-components'
import { logGTMClickStakeFarmConfirmEvent } from 'utils/customGTMEventTracking'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Hash } from 'viem'
import { useIsBloctoETH } from 'views/Farms'
import { useBCometBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCometV3/useBCometV3Info'

import { useAccount } from 'wagmi'
import useApproveFarm from '../../../hooks/useApproveFarm'
// Cross-chain farming hooks removed
import useStakeFarms, { useBCometStakeFarms } from '../../../hooks/useStakeFarms'
import useUnstakeFarms, { useBCometUnstakeFarms } from '../../../hooks/useUnstakeFarms'
import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'
import { YieldBoosterState } from '../../YieldBooster/hooks/useYieldBoosterState'

export const ActionTitles = styled.div`
  display: flex;
  margin-bottom: 8px;
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  onStake: (value: string) => Promise<Hash>
  onUnstake: (value: string) => Promise<Hash>
  onDone: () => void
  onApprove: () => Promise<Hash>
  isApproved: boolean
  shouldUseProxyFarm?: boolean
  bCometInfoSlot?: React.ReactElement
}

export function useStakedActions(lpContract, pid, vaultPid) {
  const { account, chainId } = useAccountActiveChain()
  const { onStake } = useStakeFarms(pid, vaultPid)
  const { onUnstake } = useUnstakeFarms(pid, vaultPid)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveFarm(lpContract, chainId!)

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    }
  }, [account, pid, chainId, dispatch])

  return {
    onStake,
    onUnstake,
    onApprove,
    onDone,
  }
}

export function useStakedBCometActions(bCometWrapperAddress, lpContract, pid) {
  const { account, chainId } = useAccountActiveChain()
  const { onStake } = useBCometStakeFarms(bCometWrapperAddress)
  const { onUnstake } = useBCometUnstakeFarms(bCometWrapperAddress)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveFarm(lpContract, chainId!, bCometWrapperAddress)

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchBCometWrapperUserDataAsync({ account, pids: [pid], chainId }))
    }
  }, [account, pid, chainId, dispatch])

  return {
    onStake,
    onUnstake,
    onApprove,
    onDone,
  }
}

export const ProxyStakedContainer = ({ children, ...props }) => {
  const { address: account } = useAccount()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onStake, onUnstake, onApprove, onDone } = useProxyStakedActions(props.pid, lpContract)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

export const StakedContainer = ({ children, ...props }) => {
  const { address: account } = useAccount()
  const isBooster = Boolean(props.bCometWrapperAddress)

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)
  const { onStake, onUnstake, onApprove, onDone } = useStakedActions(lpContract, props.pid, props.vaultPid)
  const {
    onStake: onBCometWrapperStake,
    onUnstake: onBCometWrapperUnStake,
    onApprove: onBCometWrapperApprove,
    onDone: onBCometWrapperDone,
  } = useStakedBCometActions(props.bCometWrapperAddress, lpContract, props.pid)

  const { allowance } = (isBooster ? props.bCometUserData : props.userData) || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake: isBooster ? onBCometWrapperStake : onStake,
    onDone: isBooster ? onBCometWrapperDone : onDone,
    onUnstake: isBooster ? onBCometWrapperUnStake : onUnstake,
    onApprove: isBooster ? onBCometWrapperApprove : onApprove,
    isApproved,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  apr,
  vaultPid,
  multiplier,
  lpSymbol,
  lpLabel,
  lpAddress,
  lpTokenPrice,
  quoteToken,
  token,
  userDataReady,
  displayApr,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  bCometUserData,
  bCometPublicData,
  bCometWrapperAddress,
  lpRewardsApr,
  onDone,
  onStake,
  onUnstake,
  onApprove,
  isApproved,
  bCometInfoSlot,
}) => {
  const dispatch = useAppDispatch()
  const native = useNativeCurrency()

  const { locked } = useBCometBoostLimitAndLockInfo()
  const pendingFarm = useCrossChainFarmPendingTransaction(lpAddress)
  const { boosterState } = useContext(YieldBoosterStateContext)
  const { isFirstTime, refresh: refreshFirstTime } = useFirstTimeCrossFarming(vaultPid)
  const { t } = useTranslation()
  const isBooster = Boolean(bCometWrapperAddress)
  const isBoosterAndRewardInRange = isBooster && bCometPublicData?.isRewardInRange
  const { toastSuccess } = useToast()
  const addTransaction = useTransactionAdder()
  const isBloctoETH = useIsBloctoETH()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()

  const { tokenBalance, stakedBalance, allowance } = (isBooster ? bCometUserData : userData) || {}

  const router = useRouter()
  const cometPrice = useCometPrice()
  const [bCometMultiplier] = useState<number | null>(() => null)

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId: token.chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item)) || pendingFarm.length > 0
  }, [pendingFarm, router])

  const crossChainWarningText = useMemo(() => {
    return isFirstTime
      ? t('A small amount of %nativeToken% is required for the first-time setup of cross-chain COMETfarming.', {
          nativeToken: native.symbol,
        })
      : t('For safety, cross-chain transactions will take around 30 minutes to confirm.')
  }, [isFirstTime, native, t])

  const handleStake = async (amount: string) => {
    logGTMClickStakeFarmConfirmEvent()
    if (vaultPid) {
      await handleCrossChainStake(amount)
      refreshFirstTime()
    } else {
      const receipt = await fetchWithCatchTxError(() => onStake(amount))

      if (receipt?.status) {
        logGTMClickStakeFarmConfirmEvent()
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the farm')}
          </ToastDescriptionWithTx>,
        )
        onDone()
      }
    }
  }

  const handleCrossChainStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onStake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt && chainId) {
      logGTMClickStakeFarmConfirmEvent()
      addTransaction(receipt, {
        type: 'cross-chain-farm',
        translatableSummary: {
          text: 'Stake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        crossChainFarm: {
          type: 'STAKE',
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              chainId: ChainId.BSC,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 3,
              chainId,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      if (chainId) {
        dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      }
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    if (vaultPid) {
      await handleCrossChainUnStake(amount)
    } else {
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
  }

  const handleCrossChainUnStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onUnstake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt && chainId) {
      addTransaction(receipt, {
        type: 'cross-chain-farm',
        translatableSummary: {
          text: 'Unstake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        crossChainFarm: {
          type: 'UNSTAKE',
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              chainId: ChainId.BSC,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 3,
              chainId,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      if (chainId) {
        dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      }
      onDone()
    }
  }

  // const bCometCalculatorSlot = (calculatorBalance) => (
  //   <BCometCalculator
  //     targetInputBalance={calculatorBalance}
  //     earningTokenPrice={cometPrice.toNumber()}
  //     lpTokenStakedAmount={lpTokenStakedAmount ?? BIG_ZERO}
  //     setBCometMultiplier={setBCometMultiplier}
  //   />
  // )

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => onApprove())
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
      max={tokenBalance ?? BIG_ZERO}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      stakedBalance={stakedBalance ?? BIG_ZERO}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      cometPrice={cometPrice}
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      bCometMultiplier={bCometMultiplier}
      showCrossChainFarmWarning={chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET && !bCometWrapperAddress}
      crossChainWarningText={crossChainWarningText}
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
      decimals={18}
      showCrossChainFarmWarning={chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET && !bCometWrapperAddress}
    />,
  )

  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  const onClickLoadingIcon = () => {
    const { length } = pendingFarm
    if (length) {
      if (length > 1) {
        onPresentTransactionModal()
      } else if (pendingFarm[0].txid && chainId) {
        dispatch(pickFarmTransactionTx({ tx: pendingFarm[0].txid, chainId }))
      }
    }
  }

  if (!account) {
    return (
      <FarmWidget.FarmTable.AccountNotConnect>
        <ConnectWalletButton width={bCometInfoSlot ? '50%' : '100%'} />
        {bCometInfoSlot}
      </FarmWidget.FarmTable.AccountNotConnect>
    )
  }

  if (!isApproved && stakedBalance?.eq(0)) {
    return (
      <FarmWidget.FarmTable.EnableStakeAction
        bCometInfoSlot={bCometInfoSlot}
        pendingTx={pendingTx || isBloctoETH}
        handleApprove={handleApprove}
      />
    )
  }

  if (!userDataReady) {
    return <FarmWidget.FarmTable.StakeActionDataNotReady bCometInfoSlot={bCometInfoSlot} />
  }

  if (stakedBalance?.gt(0)) {
    return (
      <FarmWidget.FarmTable.StakedActionComponent
        lpSymbol={lpSymbol}
        disabledMinusButton={pendingFarm.length > 0}
        disabledPlusButton={isStakeReady || isBloctoETH}
        onPresentWithdraw={onPresentWithdraw}
        onPresentDeposit={onPresentDeposit}
        bCometInfoSlot={bCometInfoSlot}
      >
        {bCometInfoSlot ? (
          <Flex flexDirection="column" flexBasis="75%">
            <ActionTitles style={{ marginBottom: 0 }}>
              <Text bold color="secondary" fontSize="12px" pr="4px">
                {lpSymbol}
              </Text>
              <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                {t('Staked')}
              </Text>
            </ActionTitles>
            <FarmWidget.StakedLP
              decimals={18}
              stakedBalance={stakedBalance}
              quoteTokenSymbol={
                chainId && WNATIVE[chainId]?.symbol === quoteToken.symbol ? NATIVE[chainId]?.symbol : quoteToken.symbol
              }
              tokenSymbol={
                chainId && WNATIVE[chainId]?.symbol === token.symbol ? NATIVE[chainId]?.symbol : token.symbol
              }
              lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
              lpTokenPrice={lpTokenPrice ?? BIG_ZERO}
              tokenAmountTotal={tokenAmountTotal ?? BIG_ZERO}
              quoteTokenAmountTotal={quoteTokenAmountTotal ?? BIG_ZERO}
              pendingFarmLength={pendingFarm.length}
              onClickLoadingIcon={onClickLoadingIcon}
            />
          </Flex>
        ) : (
          <FarmWidget.StakedLP
            decimals={18}
            stakedBalance={stakedBalance}
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
        )}
      </FarmWidget.FarmTable.StakedActionComponent>
    )
  }

  return (
    <FarmWidget.FarmTable.StakeComponent
      lpSymbol={lpSymbol}
      isStakeReady={isStakeReady}
      onPresentDeposit={onPresentDeposit}
      bCometInfoSlot={bCometInfoSlot}
    />
  )
}

export default Staked

