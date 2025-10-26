import { getPermit2Address } from '@cometswap/permit2-sdk'
import { Currency, Token } from '@cometswap/swap-sdk-core'
import { Address } from 'viem'
import { useActiveChainId } from './useActiveChainId'
import useTokenAllowance from './useTokenAllowance'

export const usePermit2Allowance = (owner?: Address, token?: Currency) => {
  const { chainId } = useActiveChainId()
  const { allowance, refetch } = useTokenAllowance(
    token?.isNative ? undefined : (token as Token),
    owner,
    getPermit2Address(chainId),
  )
  return { allowance, refetch }
}

