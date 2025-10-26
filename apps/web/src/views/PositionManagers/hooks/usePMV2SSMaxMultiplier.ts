import { bCometFarmWrapperBoosterCometABI } from '@cometswap/farms/constants/v3/abi/bCometFarmWrapperBoosterComet'
import { useQuery } from '@tanstack/react-query'
import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBCometFarmWrapperBoosterCometContract } from 'hooks/useContract'
import _toNumber from 'lodash/toNumber'
import { publicClient } from 'utils/wagmi'

export const usePMV2SSMaxBoostMultiplier = () => {
  const farmBoosterContract = useBCometFarmWrapperBoosterCometContract()
  const { chainId } = useActiveChainId()
  const enabled = Boolean(chainId)
  const { data } = useQuery({
    queryKey: [chainId, 'PMV2SSMaxMultiplier'],

    queryFn: () => {
      return getPublicMultiplier({ farmBoosterContract, chainId })
    },
    enabled,
  })
  return { maxBoostMultiplier: data ?? 2.5 }
}

export async function getPublicMultiplier({ farmBoosterContract, chainId }): Promise<number> {
  const [cAResult, caPercisionResult] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address: farmBoosterContract.address,
        functionName: 'cA',
        abi: bCometFarmWrapperBoosterCometABI,
      },
      {
        address: farmBoosterContract.address,
        functionName: 'CA_PRECISION',
        abi: bCometFarmWrapperBoosterCometABI,
      },
    ],
  })

  if (!cAResult.result || !caPercisionResult.result) return 0

  const [cA, CA_PRECISION] = [cAResult.result, caPercisionResult.result]

  const MAX_BOOST_PRECISION = new BN(cA.toString()).div(new BN(CA_PRECISION.toString()))

  return _toNumber(new BN(1).div(MAX_BOOST_PRECISION))
}

