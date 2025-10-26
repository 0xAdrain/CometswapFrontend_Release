import { ChainId } from '@cometswap/chains'
import {
  bveCometFarmBoosterV3Address,
  bveCometFarmBoosterV3veCometAddress,
  bveCometFarmWrapperBoosterveCometAddress,
} from '@cometswap/farms/constants/v3'

import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  // CometSwap: 检�?address 对象是否存在
  if (!address) {
    console.error('Address object is undefined or null')
    return '0x0000000000000000000000000000000000000000'
  }
  
  // 安全的地址获取，处理空地址情况
  const targetAddress = chainId && address[chainId] ? address[chainId] : address[ChainId.BSC]
  
  // 如果地址是空的或者未定义，返回一个默认的零地址
  if (!targetAddress || targetAddress === '0x') {
    console.warn(`Missing address for chainId ${chainId || ChainId.BSC}, using zero address`)
    return '0x0000000000000000000000000000000000000000'
  }
  
  return targetAddress
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return chainId ? address[chainId] : null
}

export const getMasterChefV2Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddressFromMap(addresses.lotteryV2)
}
export const getCometProfileAddress = () => {
  return getAddressFromMap(addresses.cometProfile)
}
export const getCometProfileProxyAddress = (chainId: number) => {
  return getAddressFromMap(addresses.cometProfileProxy, chainId)
}

export const getCometBunniesAddress = () => {
  return getAddressFromMap(addresses.cometBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddressFromMap(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddressFromMap(addresses.predictionsV1)
}
export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}
// Trading competition functionality removed

export const getVaultPoolAddress = (vaultKey: VaultKey, chainId?: ChainId) => {
  if (!vaultKey) {
    return null
  }
  return getAddressFromMap(addresses[vaultKey], chainId)
}

export const getCometVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cometVault, chainId)
}

export const getCometFlexibleSideVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cometFlexibleSideVault, chainId)
}

export const getFarmAuctionAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.farmAuction, chainId)
}

export const getNftMarketAddress = () => {
  return getAddressFromMap(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddressFromMap(addresses.nftSale)
}
export const getCometSquadAddress = () => {
  return getAddressFromMap(addresses.cometSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddressFromMap(addresses.potteryDraw)
}

export const getZapAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zap, chainId)
}

export const getBveCometFarmBoosterAddress = () => {
  return getAddressFromMap(addresses.bCometFarmBooster)
}

export const getBveCometFarmBoosterV3Address = (chainId?: number) => {
  return getAddressFromMap(bveCometFarmBoosterV3Address, chainId)
}

export const getBveCometFarmBoosterveCometAddress = (chainId?: number) => {
  return getAddressFromMap(bveCometFarmBoosterV3veCometAddress, chainId)
}

export const getBveCometFarmWrapperBoosterveCometAddress = (chainId?: number) => {
  return getAddressFromMap(bveCometFarmWrapperBoosterveCometAddress, chainId)
}

export const getBveCometFarmBoosterProxyFactoryAddress = () => {
  return getAddressFromMap(addresses.bCometFarmBoosterProxyFactory)
}

export const getZkSyncAirDropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zkSyncAirDrop, chainId)
}

export const getCrossFarmingVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingReceiver, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stableSwapNativeHelper, chainId)
}

export const getMasterChefV3Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChefV3, chainId)
}

export const getV3MigratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Migrator, chainId)
}

export const getTradingRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingReward, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}

export const getAffiliateProgramAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.affiliateProgram, chainId)
}

export const getTradingRewardTopTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingRewardTopTrades, chainId)
}

export const getVveCometAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vComet, chainId)
}

export const getRevenueSharingPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPool, chainId)
}

export const getAnniversaryAchievementAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.anniversaryAchievement, chainId)
}

export const getFixedStakingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.fixedStaking, chainId)
}

export const getveCometAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vComet, chainId)
}

export const getCometVeSenderV2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.cometVeSenderV2, chainId)
}

export const getveCometAddressNoFallback = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.vComet, chainId)
}

export const getGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVoting, chainId)
}

export const getCalcGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVotingCalc, chainId)
}

export const getRevenueSharingveCometPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingCometPool, chainId)
}

export const getRevenueSharingveCometAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingVeComet, chainId)
}

export const getRevenueSharingveCometAddressNoFallback = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.revenueSharingVeComet, chainId)
}

export const getRevenueSharingPoolGatewayAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPoolGateway, chainId)
}


