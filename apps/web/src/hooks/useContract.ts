import { getPoolContractBySousId } from '@cometswap/pools'

import { Abi, Address, erc20Abi } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import addresses from 'config/constants/contracts'
import { useEffect, useMemo, useState } from 'react'
import { getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getAffiliateProgramContract,
  getAnniversaryAchievementContract,
  getBveCometFarmBoosterContract,
  getBveCometFarmBoosterProxyFactoryContract,
  getBveCometFarmBoosterV3Contract,
  getBveCometFarmBoosterveCometContract,
  getBveCometFarmWrapperBoosterveCometContract,
  getBveCometProxyContract,
  getBunnyFactoryContract,
  getveCometFlexibleSideVaultV2Contract,
  getveCometVaultV2Contract,
  getCalcGaugesVotingContract,
  getChainlinkOracleContract,
  getContract,
  getCrossFarmingProxyContract,
  getCrossFarmingVaultContract,
  getFarmAuctionContract,
  getFixedStakingContract,
  getGaugesVotingContract,
  getIfoCreditAddressContract,
  getLotteryV2Contract,
  getMasterChefContract,
  getMasterChefV3Contract,
  getNftMarketContract,
  getNftSaleContract,
  getCometVeSenderV2Contract,
  getPointCenterIfoContract,
  getPositionManagerAdapterContract,
  getPositionManagerBveCometWrapperContract,
  getPositionManagerWrapperContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsV1Contract,
  getPredictionsV2Contract,
  getPredictionsV3Contract,
  getProfileContract,
  getRevenueSharingveCometPoolContract,
  getRevenueSharingPoolContract,
  getRevenueSharingPoolGatewayContract,
  getRevenueSharingveCometContract,
  getSidContract,
  getStableSwapNativeHelperContract,
  // Trading competition contracts removed
  getTradingRewardContract,
  getTradingRewardTopTradesContract,
  getUnsContract,
  getV2SSBveCometWrapperContract,
  getV3AirdropContract,
  getV3MigratorContract,
  getVveCometContract,
  getveCometContract,
  getZksyncAirDropContract,
  getCometVaultV2Contract,
} from 'utils/contractHelpers'

import { ChainId } from '@cometswap/chains'
import { ifoV7ABI, ifoV8ABI } from '@cometswap/ifos'
import { WNATIVE, cometPairV2ABI } from '@cometswap/sdk'
import { COMET} from '@cometswap/tokens'
import { nonfungiblePositionManagerABI } from '@cometswap/v3-sdk'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { ifoV1ABI } from 'config/abi/ifoV1'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { ifoV3ABI } from 'config/abi/ifoV3'
import { wbethBscABI } from 'config/abi/wbethBSC'
import { wbethEthABI } from 'config/abi/wbethETH'
import { zapABI } from 'config/abi/zap'
import { WBETH } from 'config/constants/liquidStaking'
import { VaultKey } from 'state/types'

import { erc721CollectionABI } from 'config/abi/erc721collection'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { wethABI } from 'config/abi/weth'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: Address) => {
  return useContract(address, ifoV1ABI)
}

export const useIfoV2Contract = (address: Address) => {
  return useContract(address, ifoV2ABI)
}

export const useIfoV3Contract = (address: Address) => {
  return useContract(address, ifoV3ABI)
}

export const useIfoV7Contract = (address: Address, options?: UseContractOptions) => {
  return useContract(address, ifoV7ABI, options)
}

export const useIfoV8Contract = (address: Address, options?: UseContractOptions) => {
  return useContract(address, ifoV8ABI, options)
}

export const useERC20 = (address?: Address, options?: UseContractOptions) => {
  return useContract(address, erc20Abi, options)
}

export const useComet = () => {
  const { chainId } = useActiveChainId()

  return useContract((chainId && COMET[chainId]?.address) ?? COMET[ChainId.BSC].address, erc20Abi)
}

export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer ?? undefined), [signer])
}

export const useProfileContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer ?? undefined), [signer])
}

export const useLotteryV2Contract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getLotteryV2Contract(signer ?? undefined), [signer])
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  const [contract, setContract] = useState(null)

  useEffect(() => {
    if (!signer || !chainId || !publicClient || !id) return

    const fetchContract = async () => {
      const poolContract = await getPoolContractBySousId({
        sousId: id,
        signer,
        chainId,
        publicClient,
      })
      setContract(poolContract)
    }

    fetchContract()
  }, [id, signer, chainId, publicClient])

  return contract
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer ?? undefined), [signer])
}

// Trading competition hooks removed

export const useVaultPoolContract = <T extends VaultKey>(
  vaultKey?: T,
):
  | (T extends VaultKey.veCometVault
      ? ReturnType<typeof getveCometVaultV2Contract>
      : ReturnType<typeof getveCometFlexibleSideVaultV2Contract>)
  | null => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.veCometVault) {
      return getveCometVaultV2Contract(signer ?? undefined, chainId)
    }
    // Flexible side vault removed - only main vault supported
    return null
  }, [signer, vaultKey, chainId]) as any
}

export const useCometVaultV2Contract = (targetChain?: ChainId) => {
  const { data: signer } = useWalletClient({ chainId: targetChain })
  const { chainId } = useActiveChainId()
  return useMemo(
    () => getCometVaultV2Contract(signer ?? undefined, targetChain ?? chainId),
    [signer, chainId, targetChain],
  )
}

export const useCometFlexibleSideVaultV2Contract = (targetChain?: ChainId) => {
  const { data: signer } = useWalletClient({ chainId: targetChain })
  const { chainId } = useActiveChainId()
  return useMemo(
    () => getveCometFlexibleSideVaultV2Contract(signer ?? undefined, targetChain ?? chainId),
    [signer, chainId, targetChain],
  )
}

export const useIfoCreditAddressContract = () => {
  return useMemo(() => getIfoCreditAddressContract(), [])
}

export const usePredictionsContract = (address: Address, isNativeToken: boolean) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer ?? undefined)
    }
    const getPredContract = isNativeToken ? getPredictionsV2Contract : getPredictionsV3Contract

    return getPredContract(address, chainId, signer ?? undefined)
  }, [address, chainId, isNativeToken, signer])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer ?? undefined), [signer, address])
}

export const useNftSaleContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftSaleContract(signer ?? undefined), [signer])
}

export const useFarmAuctionContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getFarmAuctionContract(signer ?? undefined), [signer])
}

export const useNftMarketContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketContract(signer ?? undefined), [signer])
}

export const useErc721CollectionContract = (collectionAddress: Address | undefined) => {
  return useContract(collectionAddress, erc721CollectionABI)
}

// Code below migrated from Exchange useContract.ts

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Abi)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useWBETHContract() {
  const { chainId } = useActiveChainId()

  const abi = useMemo(
    () => (chainId && [ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? wbethEthABI : wbethBscABI),
    [chainId],
  )

  return useContract(chainId ? WBETH[chainId] : undefined, abi as Abi)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address, options?: UseContractOptions) {
  return useContract(pairAddress, cometPairV2ABI, options)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export const usePotterytVaultContract = (address: Address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryVaultContract(address, signer ?? undefined), [address, signer])
}

export const usePotterytDrawContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryDrawContract(signer ?? undefined), [signer])
}

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export function useBveCometFarmBoosterContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBveCometFarmBoosterContract(signer ?? undefined), [signer])
}

export function useBveCometFarmBoosterV3Contract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBveCometFarmBoosterV3Contract(signer ?? undefined, chainId), [signer, chainId])
}

export function useBveCometFarmBoosterveCometContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBveCometFarmBoosterveCometContract(signer ?? undefined, chainId), [signer, chainId])
}

export function useBveCometFarmWrapperBoosterveCometContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBveCometFarmWrapperBoosterveCometContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useZksyncAirDropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getZksyncAirDropContract(signer ?? undefined, ChainId.ZKSYNC), [signer])
}

export function usePositionManagerWrapperContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerWrapperContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function usePositionManagerBveCometWrapperContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerBveCometWrapperContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function useV2SSBveCometWrapperContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getV2SSBveCometWrapperContract(address, signer ?? undefined, chainId), [signer, chainId, address])
}

export function usePositionManagerAdapterContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerAdapterContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function useBveCometFarmBoosterProxyFactoryContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBveCometFarmBoosterProxyFactoryContract(signer ?? undefined), [signer])
}

export function useBveCometProxyContract(proxyContractAddress: Address | undefined) {
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getBveCometProxyContract(proxyContractAddress, signer ?? undefined),
    [signer, proxyContractAddress],
  )
}

export const useCrossFarmingVault = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getCrossFarmingVaultContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useCrossFarmingProxy = (proxyContractAddress?: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, signer ?? undefined, chainId),
    [proxyContractAddress, signer, chainId],
  )
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer ?? undefined, chainId), [signer, chainId])
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
}

export function useMasterchefV3() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefV3Contract(signer ?? undefined, chainId), [signer, chainId])
}

export function useMasterchefV3ByChain(chainId: ChainId) {
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefV3Contract(signer ?? undefined, chainId), [signer, chainId])
}

export function useV3MigratorContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3MigratorContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useTradingRewardContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardContract(signer ?? undefined, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer ?? undefined), [signer])
}

export const useInfoStableSwapContract = (infoAddress?: Address) => {
  return useContract(infoAddress, infoStableSwapABI)
}

export const useAffiliateProgramContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getAffiliateProgramContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useTradingRewardTopTraderContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getTradingRewardTopTradesContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useVveCometContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getVveCometContract(signer ?? undefined, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRevenueSharingPoolContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getRevenueSharingPoolContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useAnniversaryAchievementContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getAnniversaryAchievementContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useFixedStakingContract = () => {
  const { chainId } = useActiveChainId()

  const { data: signer } = useWalletClient()

  return useMemo(() => getFixedStakingContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useVeCometContract = (targetChain?: ChainId) => {
  const { chainId } = useActiveChainId()

  const { data: signer } = useWalletClient()

  return useMemo(() => getveCometContract(signer ?? undefined, targetChain ?? chainId), [chainId, signer, targetChain])
}

export const useCometVeSenderV2Contract = (targetChainId?: ChainId) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(
    () => getCometVeSenderV2Contract(signer ?? undefined, targetChainId ?? chainId),
    [chainId, signer, targetChainId],
  )
}

export const useGaugesVotingContract = () => {
  const { chainId } = useActiveChainId()

  const { data: signer } = useWalletClient()

  return useMemo(() => getGaugesVotingContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useCalcGaugesVotingContract = () => {
  const { chainId } = useActiveChainId()

  const { data: signer } = useWalletClient()

  return useMemo(() => getCalcGaugesVotingContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useRevenueSharingveCometPoolContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingveCometPoolContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingveCometContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingveCometContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingPoolGatewayContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingPoolGatewayContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingCometPoolContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingCometPoolContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingCometContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingCometContract(signer ?? undefined, chainId), [signer, chainId])
}

