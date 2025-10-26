import { positionManagerAdapterABI, positionManagerWrapperABI } from '@cometswap/position-managers'
import { useQuery } from '@tanstack/react-query'
import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'

export const useBoosterLiquidityX = (bCometWrapperAddress?: Address, adapterAddress?: Address) => {
  const { chainId } = useActiveChainId()
  const enabled = Boolean(adapterAddress) && Boolean(bCometWrapperAddress) && Boolean(chainId)

  const { data } = useQuery({
    queryKey: ['boostedLiquidityX', adapterAddress, bCometWrapperAddress, chainId],
    queryFn: async () => {
      const boostedLiquidityX = await getBoosterLiquidityX({ bCometWrapperAddress, adapterAddress, chainId })
      return boostedLiquidityX
    },
    enabled,
  })
  return { boostedLiquidityX: data?.boostedLiquidityX ?? 1 }
}

export async function getBoosterLiquidityX({ bCometWrapperAddress, adapterAddress, chainId }): Promise<{
  boostedLiquidityX: number
} | null> {
  const [totalBoostedShareData, totalSupplyData] = await publicClient({
    chainId,
  }).multicall({
    contracts: [
      {
        address: bCometWrapperAddress,
        functionName: 'totalBoostedShare',
        abi: positionManagerWrapperABI,
      },
      {
        address: adapterAddress,
        functionName: 'totalSupply',
        abi: positionManagerAdapterABI,
      },
    ],
  })

  if (!totalBoostedShareData.result || !totalSupplyData.result) return null

  const [totalBoostedShare, totalSupply] = [totalBoostedShareData.result, totalSupplyData.result]

  return {
    boostedLiquidityX: new BN(totalBoostedShare.toString()).div(totalSupply.toString()).toNumber(),
  }
}

