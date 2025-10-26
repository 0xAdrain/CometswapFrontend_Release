import { Currency, CurrencyAmount } from '@cometswap/swap-sdk-core'
import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useApproveCallback } from 'hooks/useApproveCallback'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useMemo } from 'react'
import { getCometContract } from 'utils/contractHelpers'
import { useAccount, useWalletClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { useBSCCometToken } from './useBSCCometToken'

export const useLockAllowance = () => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const cakeToken = useBSCCometToken()
  const vecometContract = getCometContract(walletClient ?? undefined, chainId)
  const { address: account } = useAccount()

  return useTokenAllowance(cakeToken, account, vecometContract.address)
}

export const useShouldGrantAllowance = (targetAmount: bigint) => {
  const { allowance } = useLockAllowance()
  return allowance && allowance.greaterThan(targetAmount)
}

export const useLockApproveCallback = (amount: string) => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const cakeToken = useBSCCometToken()
  const vecometContract = getCometContract(walletClient ?? undefined, chainId)
  const rawAmount = useMemo(
    () => getDecimalAmount(new BN(amount || 0), cakeToken?.decimals),
    [amount, cakeToken?.decimals],
  )

  const currencyAmount = useMemo(
    () => (cakeToken ? CurrencyAmount.fromRawAmount<Currency>(cakeToken, rawAmount.toString()) : undefined),
    [cakeToken, rawAmount],
  )

  const { approvalState, approveCallback, currentAllowance } = useApproveCallback(
    currencyAmount,
    vecometContract.address,
  )

  return { approvalState, approveCallback, currentAllowance }
}

