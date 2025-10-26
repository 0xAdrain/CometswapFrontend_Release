import {
  positionManagerAdapterABI,
  positionManagerWrapperABI,
} from '@cometswap/position-managers'
import { Percent } from '@cometswap/sdk'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  useContract,
  usePositionManagerBCometWrapperContract,
  usePositionManagerWrapperContract,
} from 'hooks/useContract'
import { publicClient } from 'utils/wagmi'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'

export async function getAdapterTokensAmounts({ address, chainId }): Promise<{
  token0Amounts: bigint
  token1Amounts: bigint
  token0PerShare: bigint
  token1PerShare: bigint
  precision: bigint
  totalSupply: bigint
  managerFeePercentage: Percent
  vaultAddress: Address
  managerAddress: Address
} | null> {
  const [totalSupplyData, tokenPerShareData, PRECISIONData, managerFeeData, vaultAddressData, managerAddressData] =
    await publicClient({
      chainId,
    }).multicall({
      contracts: [
        {
          address,
          functionName: 'totalSupply',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'tokenPerShare',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'PRECISION',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'managerFee',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'vault',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'manager',
          abi: positionManagerAdapterABI,
        },
      ],
    })

  if (
    (!totalSupplyData?.result && totalSupplyData?.result !== 0n) ||
    !tokenPerShareData?.result ||
    !PRECISIONData?.result ||
    (!managerFeeData?.result && managerFeeData?.result !== 0n) ||
    !vaultAddressData?.result ||
    !managerAddressData?.result
  )
    return null

  const [totalSupply, tokenPerShare, PRECISION, managerFee, vaultAddress, managerAddress] = [
    totalSupplyData.result,
    tokenPerShareData.result,
    PRECISIONData.result,
    managerFeeData.result,
    vaultAddressData.result,
    managerAddressData.result,
  ]
  const precision = PRECISION ?? BigInt(0)
  const token0Amounts = (totalSupply * tokenPerShare[0]) / precision
  const token1Amounts = (totalSupply * tokenPerShare[1]) / precision
  const managerFeePercentage = new Percent(Number((managerFee * 100n) / precision), 10000)

  return {
    token0Amounts,
    token1Amounts,
    token0PerShare: tokenPerShare[0],
    token1PerShare: tokenPerShare[1],
    precision,
    totalSupply,
    managerFeePercentage,
    vaultAddress,
    managerAddress,
  }
}

export const useAdapterTokensAmounts = (adapterAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data, refetch } = useQuery({
    queryKey: ['AdapterTokensAmounts', adapterAddress, chainId],
    queryFn: () => getAdapterTokensAmounts({ address: adapterAddress, chainId }),
    enabled: !!adapterAddress && !!chainId,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch }
}

export const useUserAmounts = (wrapperAddress: Address, isBCometWrapper: boolean) => {
  const { address: account } = useAccount()
  const contract = usePositionManagerWrapperContract(wrapperAddress)
  const bCometContract = usePositionManagerBCometWrapperContract(wrapperAddress)
  const { data, refetch } = useQuery({
    queryKey: ['useUserAmounts', wrapperAddress, account],
    queryFn: () => contract.read.userInfo([account ?? '0x']),
    enabled: !!wrapperAddress && !!account && !isBCometWrapper,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  const { data: bCometData, refetch: bCometRefetch } = useQuery({
    queryKey: ['useBCometUserAmounts', wrapperAddress, account],
    queryFn: () => bCometContract.read.userInfo([account ?? '0x']),
    enabled: !!wrapperAddress && !!account && isBCometWrapper,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch, bCometData, bCometRefetch }
}

export const useWrapperStaticData = (wrapperAddress: Address, isBCometWrapper: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, refetch } = useQuery({
    queryKey: ['useWrapperStaticData', wrapperAddress, chainId],
    queryFn: () => getWrapperStaticData({ address: wrapperAddress, chainId }),
    enabled: !!wrapperAddress && !!chainId && !isBCometWrapper,
    refetchInterval: 30000,
    staleTime: 30000,
    gcTime: 30000,
  })
  const { data: bCometData, refetch: bCometRefetch } = useQuery({
    queryKey: ['useBCometWrapperStaticData', wrapperAddress, chainId],
    queryFn: () => getBCometWrapperStaticData({ address: wrapperAddress, chainId }),
    enabled: !!wrapperAddress && !!chainId && isBCometWrapper,
    refetchInterval: 30000,
    staleTime: 30000,
    gcTime: 30000,
  })
  return { data, refetch, bCometData, bCometRefetch }
}

export const useVaultStaticData = (vaultAddress?: Address) => {
  const { chainId } = useActiveChainId()
  const vaultContract = useContract(vaultAddress, erc20Abi)
  const { data, refetch } = useQuery({
    queryKey: ['useVaultStaticData', vaultAddress, chainId],
    queryFn: () => vaultContract?.read.decimals(),
    enabled: !!vaultAddress && !!chainId,
  })
  return { data, refetch }
}

export const usePositionInfo = (wrapperAddress: Address, adapterAddress: Address, isBCometWrapper: boolean) => {
  const {
    data: userAmounts,
    refetch: refetchUserAmounts,
    bCometData: bCometUserAmounts,
    bCometRefetch: refetchBCometUserAmounts,
  } = useUserAmounts(wrapperAddress, isBCometWrapper)
  const { data: poolAmounts, refetch: refetchPoolAmounts } = useAdapterTokensAmounts(adapterAddress)
  const { data: pendingReward, refetch: refetchPendingReward } = useUserPendingRewardAmounts(wrapperAddress)
  const { data: staticData, bCometData: bCometStaticData } = useWrapperStaticData(wrapperAddress, isBCometWrapper)
  const { data: lpTokenDecimals } = useVaultStaticData(poolAmounts?.vaultAddress)

  const poolAndUserAmountsReady = (userAmounts || bCometUserAmounts) && poolAmounts
  const bCometDataReady = bCometStaticData && bCometUserAmounts
  const userLpAmounts = isBCometWrapper ? bCometUserAmounts?.[0] ?? BigInt(0) : userAmounts?.[0] ?? BigInt(0)
  const resultStaticData = isBCometWrapper ? bCometStaticData : staticData
  return {
    pendingReward,
    poolToken0Amounts: poolAmounts?.token0Amounts ?? BigInt(0),
    poolToken1Amounts: poolAmounts?.token1Amounts ?? BigInt(0),
    userToken0Amounts: poolAndUserAmountsReady
      ? (userLpAmounts * poolAmounts?.token0PerShare) / poolAmounts.precision
      : BigInt(0),
    userToken1Amounts: poolAndUserAmountsReady
      ? (userLpAmounts * poolAmounts?.token1PerShare) / poolAmounts.precision
      : BigInt(0),
    userVaultPercentage: poolAndUserAmountsReady
      ? new Percent(userLpAmounts, poolAmounts.totalSupply)
      : new Percent(0, 100),
    refetchPositionInfo: () => {
      const refetchUser = isBCometWrapper ? refetchBCometUserAmounts : refetchUserAmounts
      refetchUser()
      refetchPoolAmounts()
      refetchPendingReward()
    },
    startTimestamp: resultStaticData?.startTimestamp ? Number(resultStaticData.startTimestamp) : 0,
    endTimestamp: resultStaticData?.endTimestamp ? Number(resultStaticData.endTimestamp) : 0,
    rewardPerSecond: resultStaticData?.rewardPerSecond ?? '',
    totalSupplyAmounts: poolAmounts?.totalSupply,
    userLpAmounts,
    boosterMultiplier:
      bCometDataReady && isBCometWrapper
        ? Number(new BigNumber(bCometUserAmounts?.[2].toString()).div(bCometStaticData.boosterPrecision.toString()))
        : 0,
    precision: poolAmounts?.precision,
    adapterAddress: resultStaticData?.adapterAddress,
    vaultAddress: poolAmounts?.vaultAddress,
    managerFeePercentage: poolAmounts?.managerFeePercentage,
    managerAddress: poolAmounts?.managerAddress,
    lpTokenDecimals,
    boosterContractAddress: bCometStaticData?.boostContractAddress,
  }
}

export const useUserPendingRewardAmounts = (wrapperAddress: Address) => {
  const { address: account } = useAccount()
  const contract = usePositionManagerWrapperContract(wrapperAddress)
  const { data, refetch } = useQuery({
    queryKey: ['useUserPendingRewardAmounts', account, wrapperAddress],
    queryFn: () => contract.read.pendingReward([account ?? '0x']),
    enabled: !!account,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch }
}

export async function getWrapperStaticData({ address, chainId }): Promise<{
  startTimestamp: string
  endTimestamp: string
  rewardPerSecond: string
  adapterAddress: Address
} | null> {
  const [startTimestampData, endTimestampData, rewardPerSecondData, adapterAddrData] = await publicClient({
    chainId,
  }).multicall({
    contracts: [
      {
        address,
        functionName: 'startTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'endTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'rewardPerSecond',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'adapterAddr',
        abi: positionManagerWrapperABI,
      },
    ],
  })

  if (!startTimestampData.result || !endTimestampData.result || !rewardPerSecondData.result || !adapterAddrData.result)
    return null

  const [startTimestamp, endTimestamp, rewardPerSecond, adapterAddress] = [
    startTimestampData.result,
    endTimestampData.result,
    rewardPerSecondData.result,
    adapterAddrData.result,
  ]

  return {
    startTimestamp: startTimestamp.toString(),
    endTimestamp: endTimestamp.toString(),
    rewardPerSecond: rewardPerSecond?.toString() ?? '',
    adapterAddress,
  }
}

export async function getBCometWrapperStaticData({ address, chainId }): Promise<{
  startTimestamp: string
  endTimestamp: string
  rewardPerSecond: string
  adapterAddress: Address
  boostContractAddress: Address
  boosterPrecision: bigint
} | null> {
  const [
    startTimestampData,
    endTimestampData,
    rewardPerSecondData,
    adapterAddrData,
    boostContractData,
    boosterPrecisionData,
  ] = await publicClient({
    chainId,
  }).multicall({
    contracts: [
      {
        address,
        functionName: 'startTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'endTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'rewardPerSecond',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'adapterAddr',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'boostContract',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'BOOST_PRECISION',
        abi: positionManagerWrapperABI,
      },
    ],
  })

  if (
    !startTimestampData.result ||
    !endTimestampData.result ||
    !rewardPerSecondData.result ||
    !adapterAddrData.result ||
    !boostContractData.result ||
    !boosterPrecisionData.result
  )
    return null

  const [startTimestamp, endTimestamp, rewardPerSecond, adapterAddress, boostContractAddress, boosterPrecision] = [
    startTimestampData.result,
    endTimestampData.result,
    rewardPerSecondData.result,
    adapterAddrData.result,
    boostContractData.result,
    boosterPrecisionData.result,
  ]

  return {
    startTimestamp: startTimestamp.toString(),
    endTimestamp: endTimestamp.toString(),
    rewardPerSecond: rewardPerSecond?.toString() ?? '',
    adapterAddress,
    boostContractAddress,
    boosterPrecision,
  }
}

