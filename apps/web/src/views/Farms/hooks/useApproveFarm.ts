import { MaxUint256 } from '@cometswap/swap-sdk-core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20 } from 'hooks/useContract'
import { useCallback } from 'react'
import { getMasterChefV2Address, getCrossFarmingVaultAddress } from 'utils/addressHelpers'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { Address } from 'viem'

const useApproveFarm = (lpContract: ReturnType<typeof useERC20>, chainId: number, bCometWrapperAddress?: Address) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const contractAddress = bCometWrapperAddress
    ? bCometWrapperAddress ?? '0x'
    : isBscNetwork
    ? getMasterChefV2Address(chainId)!
    : getCrossFarmingVaultAddress(chainId)

  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [contractAddress, MaxUint256])
  }, [lpContract, contractAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: ReturnType<typeof useERC20>, proxyAddress?: Address) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress ? callWithGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256]) : undefined
  }, [lpContract, proxyAddress, callWithGasPrice])

  return { onApprove: proxyAddress ? handleApprove : undefined }
}

