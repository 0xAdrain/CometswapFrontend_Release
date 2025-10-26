import { ChainId } from '@cometswap/chains'
import { COMET} from '@cometswap/tokens'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { useBalance, useReadContract } from '@cometswap/wagmi'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { getveCometAddress } from 'utils/addressHelpers'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address, forceBSC?: boolean, targetChainId?: ChainId) => {
  return useTokenBalanceByChain(tokenAddress, forceBSC ? ChainId.BSC : targetChainId)
}

export const useTokenBalanceByChain = (tokenAddress: Address, chainIdOverride?: ChainId) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, refetch, ...rest } = useReadContract({
    chainId: chainIdOverride || chainId,
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account || '0x'],
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  return {
    ...rest,
    refetch,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
  }
}

export const useGetBnbBalance = () => {
  const { address: account } = useAccount()

  const { status, refetch, data } = useBalance({
    chainId: ChainId.BSC,
    address: account,
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useGetNativeTokenBalance = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useBalance({
    chainId,
    address: account,
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useBSCveCometBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(COMET[ChainId.BSC]?.address, true)

  return { balance: BigInt(balance.toString()), fetchStatus }
}

// veComet only deploy on bsc/bscTestnet
export const useVeCometBalance = (targetChainId?: ChainId) => {
  const { chainId } = useActiveChainId()
  const { balance, fetchStatus } = useTokenBalance(getveCometAddress(targetChainId ?? chainId), false, targetChainId)

  return { balance, fetchStatus }
}

export default useTokenBalance

