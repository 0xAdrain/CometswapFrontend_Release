import { useTranslation } from '@cometswap/localization'
import { Skeleton, useModal, useToast } from '@cometswap/uikit'
import { FarmWidget } from '@cometswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchBCometWrapperUserDataAsync, fetchFarmUserDataAsync } from 'state/farms'

import { FarmWithStakedValue } from '@cometswap/farms'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCometPrice } from 'hooks/useCometPrice'
import { useCallback } from 'react'
import useHarvestFarm, { useBCometHarvestFarm } from '../../../hooks/useHarvestFarm'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'

const { FarmTableHarvestAction } = FarmWidget.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward?: <TResult>() => Promise<TResult>
  proxyCometBalance?: number
  onDone?: () => void
  style?: React.CSSProperties
}

export const ProxyHarvestActionContainer = ({ children, ...props }) => {
  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onReward, onDone, proxyCometBalance } = useProxyStakedActions(props.pid, lpContract)

  return children({ ...props, onReward, proxyCometBalance, onDone })
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  const { onReward: onRewardBComet } = useBCometHarvestFarm(props.bCometWrapperAddress ?? '0x')
  const isBooster = Boolean(props.bCometWrapperAddress)
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId }))
    }
  }, [account, dispatch, chainId, props.pid])
  const onBCometDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchBCometWrapperUserDataAsync({ account, pids: [props.pid], chainId }))
    }
  }, [account, dispatch, chainId, props.pid])

  return children({
    ...props,
    onDone: isBooster ? onBCometDone : onDone,
    onReward: isBooster ? onRewardBComet : onReward,
  })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  userData,
  userDataReady,
  proxyCometBalance,
  lpSymbol,
  onReward,
  onDone,
  bCometUserData,
  bCometWrapperAddress,
  style,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = bCometWrapperAddress
    ? new BigNumber(bCometUserData?.earnings ?? 0)
    : new BigNumber(userData?.earnings ?? 0)
  const cometPrice = useCometPrice()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cometPrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  const onClickHarvestButton = () => {
    // Cross-chain harvest removed - always use direct harvest
    handleHarvest()
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError((): any => onReward?.())
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
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      proxyCometBalance={proxyCometBalance}
      disabled={earnings.eq(0) || pendingTx || !userDataReady}
      handleHarvest={onClickHarvestButton}
      style={style}
    />
  )
}

export default HarvestAction

