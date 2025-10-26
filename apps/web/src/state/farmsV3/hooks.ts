import { ChainId } from '@cometswap/chains'
import {
  FarmV3DataWithPrice,
  FarmV3DataWithPriceAndUserInfo,
  FarmV3DataWithPriceTVL,
  FarmsV3Response,
  IPendingCometByTokenId,
  PositionDetails,
  Protocol,
  SerializedFarmsV3Response,
  UniversalFarmConfigV3,
  bCometSupportedChainId,
  createFarmFetcherV3,
  defineFarmV3ConfigsFromUniversalFarm,
  fetchUniversalFarms,
  supportedChainIdV3,
} from '@cometswap/farms'
import { priceHelperTokens } from '@cometswap/farms/constants/common'
import { bveCometFarmBoosterveCometABI as bCometFarmBoosterVeCometABI } from '@cometswap/farms/constants/v3/abi/bveCometFarmBoosterveComet'
import { TvlMap, fetchCommonTokenUSDValue } from '@cometswap/farms/src/fetchFarmsV3'
import { deserializeToken } from '@cometswap/token-lists'
import { masterChefV3ABI } from '@cometswap/v3-sdk'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import BN from 'bignumber.js'
import { FAST_INTERVAL } from 'config/constants'
import { FARMS_API_V2 } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCometPrice } from 'hooks/useCometPrice'
import {
  useBCometFarmBoosterVeCometContract,
  useMasterchefV3,
  useMasterchefV3ByChain,
  useV3NFTPositionManagerContract,
} from 'hooks/useContract'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import chunk from 'lodash/chunk'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import { safeGetAddress } from 'utils'
import fetchWithTimeout from 'utils/fetchWithTimeout'
import { getViemClients } from 'utils/viem'
import { publicClient } from 'utils/wagmi'
import { Hex, decodeFunctionResult, encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'

export const farmV3ApiFetch = (chainId: number): Promise<FarmsV3Response> =>
  fetch(`/api/v3/${chainId}/farms`)
    .then((res) => res.json())
    .then((data: SerializedFarmsV3Response) => {
      const farmsWithPrice = data.farmsWithPrice.map((f) => ({
        ...f,
        token: deserializeToken(f.token),
        quoteToken: deserializeToken(f.quoteToken),
      }))

      return {
        chainId,
        ...data,
        farmsWithPrice,
      }
    })

const fallback: Awaited<ReturnType<typeof farmFetcherV3.fetchFarms>> = {
  chainId: ChainId.BSC,
  farmsWithPrice: [],
  poolLength: 0,
  cometPerSecond: '0',
  totalAllocPoint: '0',
}

const API_FLAG = false

const farmFetcherV3 = createFarmFetcherV3(getViemClients)

export const useFarmsV3Public = () => {
  const { chainId } = useActiveChainId()

  const resp = useQuery({
    queryKey: [chainId, 'farmV3ApiFetch'],

    queryFn: async () => {
      if (API_FLAG && chainId) {
        return farmV3ApiFetch(chainId).catch((err) => {
          console.error(err)
          return fallback
        })
      }

      try {
        // direct copy from api routes, the client side fetch is preventing cache due to migration phase we want fresh data
        const fetchFarmsV3 = await fetchUniversalFarms(chainId, Protocol.V3)
        const farms = defineFarmV3ConfigsFromUniversalFarm(fetchFarmsV3 as UniversalFarmConfigV3[])
        const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId ?? -1])

        const data = await farmFetcherV3.fetchFarms({
          chainId: chainId ?? -1,
          farms,
          commonPrice,
        })
        return {
          ...data,
          farmsWithPrice: data.farmsWithPrice
            .map((farm) => {
              const checksummedAddress = safeGetAddress(farm.lpAddress)
              return checksummedAddress ? { ...farm, lpAddress: checksummedAddress } : undefined
            })
            .filter((farm): farm is FarmV3DataWithPrice => Boolean(farm)),
        }
      } catch (error) {
        console.error(error)
        // return fallback for now since not all chains supported
        return fallback
      }
    },
    refetchInterval: 1_000 * 60 * 10,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(farmFetcherV3.isChainSupported(chainId ?? -1)),
  })

  return {
    ...resp,
    data: resp?.data ?? fallback,
  }
}

interface UseFarmsOptions {
  // mock apr when tvl is 0
  mockApr?: boolean
  boosterLiquidityX?: Record<number, number>
}

export const useFarmsV3 = ({ mockApr = false, boosterLiquidityX = {} }: UseFarmsOptions = {}) => {
  const { chainId } = useActiveChainId()

  const farmV3 = useFarmsV3Public()

  const cometPrice = useCometPrice()

  const { data } = useQuery({
    queryKey: [chainId, 'comet-apr-tvl', boosterLiquidityX],

    queryFn: async ({ signal }) => {
      if (chainId !== farmV3?.data?.chainId) {
        throw new Error('ChainId mismatch')
      }
      const tvls: TvlMap = {}
      if (supportedChainIdV3.includes(chainId)) {
        const farmsToFetch = farmV3.data.farmsWithPrice.filter((f) => f.poolWeight !== '0')

        // Chunk farm addresses into batches of 10
        const addressChunks = chunk(
          farmsToFetch.map((f) => f.lpAddress),
          10,
        )

        const results = await Promise.allSettled(
          addressChunks.map((addressChunk, index) =>
            fetchWithTimeout(`${FARMS_API_V2}/v3/${chainId}/liquidity?page=${index + 1}&size=10`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ farmAddresses: addressChunk }),
              signal,
            })
              .then((r) => r.json())
              .catch((err) => {
                console.error(err)
                throw err
              }),
          ),
        )

        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            r.value.data.forEach((value) => {
              const checksummedAddress = safeGetAddress(value.farmAddress)
              if (checksummedAddress) {
                tvls[checksummedAddress] = { ...value.formatted, updatedAt: new Date() }
              }
            })
          }
        })
      }

      const farmWithPriceAndCometAPR = farmV3.data.farmsWithPrice.map((f) => {
        if (!tvls[f.lpAddress]) {
          return f
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tvl = tvls[f.lpAddress]!
        // Mock 1$ tvl if the farm doesn't have lp staked
        if (mockApr && tvl?.token0 === '0' && tvl?.token1 === '0') {
          const [token0Price, token1Price] = f.token.sortsBefore(f.quoteToken)
            ? [f.tokenPriceBusd, f.quoteTokenPriceBusd]
            : [f.quoteTokenPriceBusd, f.tokenPriceBusd]
          tvl.token0 = token0Price ? String(1 / Number(token0Price)) : '1'
          tvl.token1 = token1Price ? String(1 / Number(token1Price)) : '1'
        }
        const { activeTvlUSD, activeTvlUSDUpdatedAt, cometApr } = farmFetcherV3.getCometAprAndTVL(
          f,
          tvl,
          cometPrice.toString(),
          farmV3.data?.cometPerSecond ?? '1',
          boosterLiquidityX?.[f.pid] ?? 1,
        )

        return {
          ...f,
          cometApr,
          activeTvlUSD,
          activeTvlUSDUpdatedAt,
        }
      })

      return {
        ...farmV3.data,
        farmsWithPrice: farmWithPriceAndCometAPR,
      }
    },

    enabled: Boolean(farmV3?.data?.farmsWithPrice && farmV3?.data?.farmsWithPrice?.length > 0),
    placeholderData: (previousData, previousQuery) => {
      const queryKey = previousQuery?.queryKey
      if (!queryKey) return undefined

      if (queryKey[0] === chainId) {
        return previousData
      }

      return undefined
    },
    refetchInterval: FAST_INTERVAL * 3,
    staleTime: FAST_INTERVAL * 3,
  })

  return {
    data: useMemo(() => {
      return farmV3.isLoading || farmV3.data?.chainId !== chainId
        ? (farmV3.data as FarmsV3Response<FarmV3DataWithPriceTVL>)
        : ((data?.chainId !== chainId ? farmV3.data : data ?? farmV3.data) as FarmsV3Response<FarmV3DataWithPriceTVL>)
    }, [chainId, data, farmV3.data, farmV3.isLoading]),
    isLoading: farmV3.isLoading,
    error: farmV3.error,
  }
}

const zkSyncChains = [ChainId.ZKSYNC_TESTNET, ChainId.ZKSYNC]

export const useStakedPositionsByUser = (stakedTokenIds: bigint[], _chainId?: number) => {
  const { address: account } = useAccount()
  const { chainId: activeChainId } = useActiveChainId()
  const chainId = _chainId ?? activeChainId
  const masterchefV3 = useMasterchefV3ByChain(chainId)

  const harvestCalls = useMemo(() => {
    if (!masterchefV3?.abi || !account || !supportedChainIdV3.includes(chainId ?? -1)) return []
    const callData: Hex[] = []
    for (const stakedTokenId of stakedTokenIds) {
      if (zkSyncChains.includes(chainId ?? -1)) {
        callData.push(
          encodeFunctionData({
            abi: masterchefV3?.abi ?? [],
            functionName: 'pendingComet',
            args: [stakedTokenId],
          }),
        )
      } else {
        callData.push(
          encodeFunctionData({
            abi: masterchefV3?.abi ?? [],
            functionName: 'harvest',
            args: [stakedTokenId, account],
          }),
        )
      }
    }

    return callData
  }, [account, masterchefV3?.abi, stakedTokenIds, chainId])

  const { data } = useQuery<bigint[]>({
    queryKey: ['mcv3-harvest', ...harvestCalls],

    queryFn: () => {
      if (!masterchefV3 || !harvestCalls.length) return []

      return masterchefV3?.simulate.multicall([harvestCalls], { account, value: 0n }).then((res) => {
        return res.result
          .map((r) =>
            decodeFunctionResult({
              abi: masterchefV3?.abi,
              functionName: zkSyncChains.includes(chainId ?? 0) ? 'pendingComet' : 'harvest',
              data: r,
            }),
          )
          .map((r) => {
            return r
          })
      })
    },
    enabled: Boolean(account && chainId),
    placeholderData: keepPreviousData,
  })

  return { tokenIdResults: useMemo(() => data || [], [data]), isLoading: harvestCalls.length > 0 && !data }
}

const usePositionsByUserFarms = (
  farmsV3: FarmV3DataWithPrice[],
): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
} => {
  const { address: account } = useAccount()
  const positionManager = useV3NFTPositionManagerContract()
  const masterchefV3 = useMasterchefV3()

  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const stakedIds = useMemo(() => stakedTokenIds || [], [stakedTokenIds])

  const { tokenIds } = useV3TokenIdsByAccount(positionManager?.address, account)

  const uniqueTokenIds = useMemo(() => [...stakedIds, ...tokenIds], [stakedIds, tokenIds])

  const { positions } = useV3PositionsFromTokenIds(uniqueTokenIds)

  const { tokenIdResults, isLoading: isStakedPositionLoading } = useStakedPositionsByUser(stakedIds)

  const [unstakedPositions, stakedPositions] = useMemo(() => {
    if (!positions) return [[], []]
    const unstakedIds = tokenIds.filter((id) => !stakedIds.find((s) => s === id))
    return [
      unstakedIds
        .map((id) => positions.find((p) => p.tokenId === id))
        .filter((p) => (p?.liquidity ?? 0n) > 0n) as PositionDetails[],
      stakedIds
        .map((id) => positions.find((p) => p.tokenId === id))
        .filter((p) => (p?.liquidity ?? 0n) > 0n) as PositionDetails[],
    ]
  }, [positions, stakedIds, tokenIds])

  const pendingCometByTokenIds = useMemo(
    () =>
      (tokenIdResults as bigint[])?.reduce<IPendingCometByTokenId>((acc, pendingComet, i) => {
        const position = stakedPositions[i]

        return pendingComet && position?.tokenId ? { ...acc, [position.tokenId.toString()]: pendingComet } : acc
      }, {} as IPendingCometByTokenId) ?? {},
    [stakedPositions, tokenIdResults],
  )

  // assume that if any of the tokenIds have a valid result, the data is ready
  const userDataLoaded = !isStakedPositionLoading

  const farmsWithPositions = useMemo(
    () =>
      farmsV3.map((farm) => {
        const { feeAmount, token0, token1 } = farm

        const unstaked = unstakedPositions.filter(
          (p) =>
            toLower(p?.token0) === toLower(token0.address) &&
            toLower(p?.token1) === toLower(token1.address) &&
            feeAmount === p?.fee,
        )
        const staked = stakedPositions.filter((p) => {
          return (
            toLower(p?.token0) === toLower(token0.address) &&
            toLower(p?.token1) === toLower(token1.address) &&
            feeAmount === p?.fee
          )
        })

        return {
          ...farm,
          unstakedPositions: unstaked,
          stakedPositions: staked,
          pendingCometByTokenIds: Object.entries(pendingCometByTokenIds).reduce<IPendingCometByTokenId>(
            (acc, [tokenId, comet]) => {
              const foundPosition = staked.find((p) => p?.tokenId === BigInt(tokenId))

              if (foundPosition) {
                return { ...acc, [tokenId]: comet }
              }

              return acc
            },
            {},
          ),
        }
      }),
    [farmsV3, pendingCometByTokenIds, stakedPositions, unstakedPositions],
  )

  return {
    farmsWithPositions,
    userDataLoaded,
  }
}

export function useFarmsV3WithPositionsAndBooster(options: UseFarmsOptions = {}): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
  cometPerSecond: string
  poolLength: number
  isLoading: boolean
} {
  const { data: boosterLiquidityX } = useV3BoostedLiquidityX()
  const { data, isLoading } = useFarmsV3({ ...options, boosterLiquidityX })
  const { data: boosterWhitelist } = useV3BoostedFarm(data?.farmsWithPrice?.map((f) => f.pid))

  return {
    ...usePositionsByUserFarms(
      data.farmsWithPrice?.map((d, index) => ({
        ...d,
        boosted: boosterWhitelist?.[index]?.boosted,
      })),
    ),
    poolLength: data.poolLength,
    cometPerSecond: data.cometPerSecond,
    isLoading,
  }
}

const useV3BoostedFarm = (pids?: number[]) => {
  const { chainId } = useActiveChainId()
  const farmBoosterVeCometContract = useBCometFarmBoosterVeCometContract()

  const { data } = useQuery({
    queryKey: ['v3/boostedFarm', chainId, pids?.join('-')],

    queryFn: () =>
      getV3FarmBoosterWhiteList({
        farmBoosterContract: farmBoosterVeCometContract,
        chainId: chainId ?? -1,
        pids: pids ?? [],
      }),

    enabled: Boolean(chainId && pids && pids.length > 0 && bCometSupportedChainId.includes(chainId)),
    retry: 3,
    retryDelay: 3000,
  })
  return { data }
}

const useV3BoostedLiquidityX = (): { data: Record<number, number> } => {
  const farmV3 = useFarmsV3Public()
  const pids = useMemo(() => farmV3?.data?.farmsWithPrice?.map((f) => f.pid), [farmV3?.data?.farmsWithPrice])
  const { chainId } = useActiveChainId()
  const masterChefV3Contract = useMasterchefV3()

  const { data } = useQuery({
    queryKey: ['v3/getV3BoosterAPRLiquidityX', chainId, pids?.join('-')],

    queryFn: () =>
      getV3BoosterAPRLiquidityX({
        masterChefV3Contract,
        chainId: chainId ?? -1,
        pids: pids ?? [],
      }),

    enabled: Boolean(chainId && pids && pids.length > 0 && bCometSupportedChainId.includes(chainId)),
  })

  return useMemo(() => {
    const dataMap = data?.reduce((acc, d) => {
      // eslint-disable-next-line no-param-reassign
      acc[d.pid] = Number.isNaN(d.boosterliquidityX) ? 1 : d.boosterliquidityX
      return acc
    }, {})
    return {
      data: dataMap ?? {},
    }
  }, [data])
}

export const getV3FarmBoosterWhiteList = async ({
  farmBoosterContract,
  chainId,
  pids,
}: {
  farmBoosterContract: ReturnType<typeof useBCometFarmBoosterVeCometContract>
  chainId: ChainId
  pids: number[]
}): Promise<{ pid: number; boosted: boolean }[]> => {
  const contracts = pids?.map((pid) => {
    return {
      address: farmBoosterContract.address,
      functionName: 'whiteList',
      abi: bCometFarmBoosterVeCometABI,
      args: [BigInt(pid)],
    } as const
  })
  const whiteList = await publicClient({ chainId }).multicall({
    contracts,
  })

  if (!whiteList || whiteList?.length !== pids?.length) return []
  return pids?.map((d, index) => ({ pid: d, boosted: whiteList[index].result ?? false }))
}

export const getV3BoosterAPRLiquidityX = async ({
  masterChefV3Contract,
  chainId,
  pids,
}: {
  masterChefV3Contract: ReturnType<typeof useMasterchefV3>
  chainId: ChainId
  pids: number[]
}): Promise<{ pid: number; boosterliquidityX: number }[]> => {
  const contracts = pids?.map((pid) => {
    return {
      address: masterChefV3Contract?.address ?? '0x',
      functionName: 'poolInfo',
      abi: masterChefV3ABI,
      args: [BigInt(pid)],
    } as const
  })
  const data = await publicClient({ chainId }).multicall({
    contracts,
  })

  if (!data || data?.length !== pids?.length) return []

  return pids?.map((d, index) => ({
    pid: d,
    boosterliquidityX:
      new BN(data?.[index]?.result?.[6]?.toString() ?? 1).div(data?.[index]?.result?.[5]?.toString() ?? 1).toNumber() ??
      1,
  }))
}
