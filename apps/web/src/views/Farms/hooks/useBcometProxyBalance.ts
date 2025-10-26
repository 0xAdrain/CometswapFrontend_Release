import { COMET} from '@cometswap/tokens'
import { getBalanceAmount, getFullDisplayBalance } from '@cometswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useBCometProxyContract, useComet } from 'hooks/useContract'
import { useMemo } from 'react'
import { useBCometProxyContractAddress } from 'hooks/useBCometProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBCometProxyBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCometProxyContractAddress(account, chainId)
  const bCometProxy = useBCometProxyContract(proxyAddress)
  const cakeContract = useComet()

  const { data, status } = useQuery({
    queryKey: ['bCometProxyBalance', account],

    queryFn: async () => {
      const rawBalance = await cakeContract?.read.balanceOf([bCometProxy!.address])
      return rawBalance ? new BigNumber(rawBalance.toString()) : new BigNumber(0)
    },

    enabled: Boolean(account && bCometProxy && !isProxyContractAddressLoading),
  })

  const balanceAmount = useMemo(
    () => (data && chainId ? getBalanceAmount(data, COMET[chainId].decimals) : new BigNumber(NaN)),
    [data, chainId],
  )

  return useMemo(() => {
    return {
      bCometProxyBalance: data ? balanceAmount.toNumber() : 0,
      bCometProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD) && chainId
          ? getFullDisplayBalance(data, COMET[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== 'success',
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBCometProxyBalance

