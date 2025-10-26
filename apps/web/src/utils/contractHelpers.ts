import { ChainId } from '@cometswap/chains'
// import { COMET} from '@cometswap/tokens' // Unused

// Addresses
import {
  getAffiliateProgramAddress,
  getAnniversaryAchievementAddress,
  getBveCometFarmBoosterAddress,
  getBveCometFarmBoosterProxyFactoryAddress,
  getBveCometFarmBoosterV3Address,
  getBveCometFarmBoosterveCometAddress,
  getBveCometFarmWrapperBoosterveCometAddress,
  getBunnyFactoryAddress,
  getveCometFlexibleSideVaultAddress,
  getveCometVaultAddress,
  getCalcGaugesVotingAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getCrossFarmingVaultAddress,
  getFarmAuctionAddress,
  getFixedStakingAddress,
  getGaugesVotingAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNftMarketAddress,
  getNftSaleAddress,
  getCometProfileAddress,
  getCometSquadAddress,
  getCometVeSenderV2Address,
  getPointCenterIfoAddress,
  getPotteryDrawAddress,
  getPredictionsV1Address,
  getRevenueSharingveCometPoolAddress,
  getRevenueSharingPoolAddress,
  getRevenueSharingPoolGatewayAddress,
  getRevenueSharingveCometAddress,
  getStableSwapNativeHelperAddress,
  getTradingRewardAddress,
  getTradingRewardTopTradesAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
  getVveCometAddress,
  getveCometAddress,
  getZkSyncAirDropAddress,
  getCometVaultAddress,
  getCometFlexibleSideVaultAddress,
} from 'utils/addressHelpers'

// ABI
import { predictionsV1ABI, predictionsV2ABI, predictionsV3ABI } from '@cometswap/prediction'
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { crossFarmingVaultABI } from 'config/abi/crossFarmingVault'
import { nftSaleABI } from 'config/abi/nftSale'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import { bveCometFarmBoosterV3ABI } from '@cometswap/farms/constants/v3/abi/bCometFarmBoosterV3'
import { bveCometFarmBoosterveCometABI } from '@cometswap/farms/constants/v3/abi/bveCometFarmBoosterveComet'
import { bveCometFarmWrapperBoosterveCometABI } from '@cometswap/farms/constants/v3/abi/bveCometFarmWrapperBoosterVeComet'
import { calcGaugesVotingABI, gaugesVotingABI } from '@cometswap/gauges'
import { getIfoCreditAddressContract as getIfoCreditAddressContract_ } from '@cometswap/ifos'
import { cometFlexibleSideVaultV2ABI, cometVaultV2ABI } from '@cometswap/pools'
import {
  positionManagerAdapterABI,
  positionManagerWrapperABI,
} from '@cometswap/position-managers'
import { masterChefV3ABI } from '@cometswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { affiliateProgramABI } from 'config/abi/affiliateProgram'
import { anniversaryAchievementABI } from 'config/abi/anniversaryAchievement'
import { bveCometFarmBoosterABI } from 'config/abi/bCometFarmBooster'
import { bveCometFarmBoosterProxyFactoryABI } from 'config/abi/bCometFarmBoosterProxyFactory'
import { bveCometProxyABI } from 'config/abi/bCometProxy'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { fixedStakingABI } from 'config/abi/fixedStaking'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { nftMarketABI } from 'config/abi/nftMarket'
import { cometProfileABI } from 'config/abi/cometProfile'
import { cometSquadABI } from 'config/abi/cometSquad'
import { cometVeSenderV2ABI } from 'config/abi/cometVeSenderV2ABI'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { revenueSharingPoolGatewayABI } from 'config/abi/revenueSharingPoolGateway'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
// Trading competition ABIs removed
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v2BCometWrapperABI } from 'config/abi/v2BCometWrapper'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { vveCometABI } from 'config/abi/vComet'
import { vecometABI } from 'config/abi/veComet'
import { zkSyncAirDropABI } from 'config/abi/zksyncAirdrop'
import { getViemClients, viemClients } from 'utils/viem'
import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  erc20Abi,
  erc721Abi,
  getContract as viemGetContract,
} from 'viem'

export const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi | readonly unknown[]
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: publicClient ?? viemClients[chainId],
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>

  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20Abi, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721Abi,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: cometProfileABI, address: getCometProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}

// Trading competition contracts removed

export const getCometVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cometVaultV2ABI, address: getCometVaultAddress(chainId), signer, chainId })
}

export const getCometFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  console.log('Error Probe: getCometFlexibleSideVaultV2Contract is being called!')
  return getContract({
    abi: cometFlexibleSideVaultV2ABI,
    address: getCometFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getPredictionsV3Contract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: predictionsV3ABI, address, signer, chainId })
}

export const getPredictionsV2Contract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer, chainId })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1ABI, address: getPredictionsV1Address(), signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(chainId), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}
export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleABI, address: getNftSaleAddress(), signer })
}
export const getCometSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: cometSquadABI, address: getCometSquadAddress(), signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract({ abi: potteryVaultABI, address, signer: walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract({ abi: potteryDrawABI, address: getPotteryDrawAddress(), signer: walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getIfoCreditAddressContract_(ChainId.BSC, getViemClients, signer)
}

export const getBveCometFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bveCometFarmBoosterABI, address: getBveCometFarmBoosterAddress(), signer })
}

export const getBveCometFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bveCometFarmBoosterV3ABI, address: getBveCometFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBveCometFarmBoosterveCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bveCometFarmBoosterveCometABI,
    address: getBveCometFarmBoosterveCometAddress(chainId),
    signer,
    chainId,
  })
}

export const getBveCometFarmWrapperBoosterveCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bveCometFarmWrapperBoosterveCometABI,
    address: getBveCometFarmWrapperBoosterveCometAddress(chainId),
    signer,
    chainId,
  })
}

export const getZksyncAirDropContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: zkSyncAirDropABI,
    address: getZkSyncAirDropAddress(chainId),
    signer,
    chainId,
  })
}

export const getPositionManagerWrapperContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerBveCometWrapperContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getV2SSBveCometWrapperContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v2BCometWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerAdapterContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerAdapterABI,
    address,
    signer,
    chainId,
  })
}

export const getBveCometFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bveCometFarmBoosterProxyFactoryABI,
    address: getBveCometFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBveCometProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bveCometProxyABI, address: proxyContractAddress, signer })
}

export const getCrossFarmingVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: crossFarmingVaultABI, address: getCrossFarmingVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  const mcv2Address = getMasterChefV2Address(chainId)
  return mcv2Address
    ? getContract({
        abi: masterChefV2ABI,
        address: mcv2Address,
        chainId,
        signer,
      })
    : null
}

export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  const mcv3Address = getMasterChefV3Address(chainId)
  return mcv3Address
    ? getContract({
        abi: masterChefV3ABI,
        address: mcv3Address,
        chainId,
        signer,
      })
    : null
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getAffiliateProgramContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: affiliateProgramABI,
    address: getAffiliateProgramAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getVveCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vveCometABI,
    address: getVveCometAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolABI,
    address: getRevenueSharingPoolAddress(chainId),
    signer,
    chainId,
  })
}

export const getAnniversaryAchievementContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: anniversaryAchievementABI,
    address: getAnniversaryAchievementAddress(chainId),
  })
}

export const getFixedStakingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fixedStakingABI,
    address: getFixedStakingAddress(chainId),
    signer,
    chainId,
  })
}

export const getveCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vecometABI,
    address: getveCometAddress(chainId) ?? getveCometAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getCometVeSenderV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cometVeSenderV2ABI,
    address: getCometVeSenderV2Address(chainId) ?? getCometVeSenderV2Address(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gaugesVotingABI,
    address: getGaugesVotingAddress(chainId) ?? getGaugesVotingAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getCalcGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: calcGaugesVotingABI,
    address: getCalcGaugesVotingAddress(chainId) ?? getCalcGaugesVotingAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingveCometPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingveCometPoolAddress(chainId) ?? getRevenueSharingveCometPoolAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingveCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingveCometAddress(chainId) ?? getRevenueSharingveCometAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolGatewayContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolGatewayABI,
    address: getRevenueSharingPoolGatewayAddress(chainId) ?? getRevenueSharingPoolGatewayAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingCometPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingveCometPoolAddress(chainId) ?? getRevenueSharingveCometPoolAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingCometContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingveCometAddress(chainId) ?? getRevenueSharingveCometAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

