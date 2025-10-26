import { ChainId } from '@cometswap/chains'
import BigNumber from 'bignumber.js'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { formatEther } from 'viem'
import { useReadContract } from '@cometswap/wagmi'
import { useCallback } from 'react'

const COMET_PER_BLOCK = 40
const masterChefAddress = getMasterChefV2Address(ChainId.BSC)!

export const useVeCometEmissionPerBlock = (inView?: boolean) => {
  const { data: emissionsPerBlock } = useReadContract({
    abi: masterChefV2ABI,
    address: masterChefAddress,
    chainId: ChainId.BSC,
    functionName: 'cakePerBlockToBurn',
    query: {
      enabled: inView,
      select: useCallback((d: bigint) => {
        const burn = formatEther(d)
        return new BigNumber(COMET_PER_BLOCK).minus(burn).toNumber()
      }, []),
    },
  })

  return emissionsPerBlock
}

