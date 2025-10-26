import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { getCometContract } from 'utils/contractHelpers'
import { useBCometProxyContractAddress } from 'hooks/useBCometProxyContractAddress'
import { useReadContract } from '@cometswap/wagmi'
import { useCallback } from 'react'

const useProxyCOMETBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBCometProxyContractAddress(account, chainId)
  const cakeContract = getCometContract()

  const { data = 0, refetch } = useReadContract({
    chainId,
    address: cakeContract.address,
    abi: cakeContract.abi,
    query: {
      enabled: Boolean(account && proxyAddress),
      select: useCallback(
        (cakeBalance: bigint) => (cakeBalance ? getBalanceNumber(new BigNumber(cakeBalance.toString())) : 0),
        [],
      ),
    },
    functionName: 'balanceOf',
    args: proxyAddress && [proxyAddress],
  })

  return {
    refreshProxyCometBalance: refetch,
    proxyCometBalance: data,
  }
}

export default useProxyCOMETBalance

