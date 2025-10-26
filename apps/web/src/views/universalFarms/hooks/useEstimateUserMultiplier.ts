import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { vecometABI } from 'config/abi/Comet'
import { SLOW_INTERVAL } from 'config/constants'
import { useVeCometBalance } from 'hooks/useTokenBalance'
import { useCallback } from 'react'
import { getCometAddress } from 'utils/addressHelpers'
import { getBCometFarmWrapperBoosterCometContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/viem'
import { getUserMultiplier } from 'views/Farms/components/YieldBooster/hooks/bCometV3/multiplierAPI'
import { useMasterChefV3FarmBoosterAddress } from './useMasterChefV3FarmBoosterAddress'

export const useEstimateUserMultiplier = (chainId: number, tokenId?: bigint) => {
  const { data: farmBoosterAddress } = useMasterChefV3FarmBoosterAddress(chainId)
  return useQuery({
    queryKey: ['useEstimateUserMultiplier', farmBoosterAddress, chainId, tokenId?.toString()],
    queryFn: async () => {
      return getUserMultiplier({ address: farmBoosterAddress, tokenId, chainId })
    },
    enabled: !!farmBoosterAddress && !!tokenId && !!chainId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  })
}

export const useV2EstimateUserMultiplier = (chainId: number, userLiquidity: bigint = 0n, lpLiquidity: bigint = 0n) => {
  const vecometBalance = useVeCometBalance(chainId)
  const farmBooster = getBCometFarmWrapperBoosterCometContract(undefined, chainId)
  const queryFn = useCallback(async () => {
    const client = publicClient({ chainId })
    const [cA, CA_PRECISION, cB, CB_PRECISION, vecometTotalSupply] = await client.multicall({
      contracts: [
        {
          address: farmBooster.address,
          functionName: 'cA',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'CA_PRECISION',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'cB',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'CB_PRECISION',
          abi: farmBooster.abi,
        },
        {
          address: getCometAddress(chainId),
          functionName: 'totalSupply',
          abi: vecometABI,
        },
      ],
      allowFailure: false,
    })
    const CA = new BigNumber(cA.toString()).div(CA_PRECISION.toString())
    const CB = new BigNumber(cB.toString()).div(CB_PRECISION.toString())
    const dB = CA.times(userLiquidity.toString())
    const aB = vecometBalance.balance.times(lpLiquidity.toString()).div(CB.times(vecometTotalSupply.toString()))
    const min = dB.plus(aB).lt(userLiquidity.toString()) ? new BigNumber(userLiquidity.toString()) : dB.plus(aB)
    return min.div(dB)
  }, [chainId, farmBooster.abi, farmBooster.address, lpLiquidity, userLiquidity, vecometBalance.balance])

  return useQuery({
    queryKey: ['useV2EstimateUserMultiplier', chainId, userLiquidity?.toString(), lpLiquidity?.toString()],
    queryFn,
    enabled: !!chainId && !!userLiquidity && !!lpLiquidity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
}

