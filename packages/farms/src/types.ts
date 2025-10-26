import { SerializedToken, Token } from '@cometswap/swap-sdk-core'
import { SerializedWrappedToken } from '@cometswap/token-lists'
import { FeeAmount } from '@cometswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { Address, Prettify } from 'viem'

export type FarmsDynamicDataResult = {
  tokenAmountTotal: string
  quoteTokenAmountTotal: string
  lpTotalSupply: string
  lpTotalInQuoteToken: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}

export type FarmsDynamicDataResultV2 = {
  lmPool: string
  lmPoolLiquidity: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}

export type FarmPriceV3 = {
  tokenPriceBusd: string
  quoteTokenPriceBusd: string
}

export type FarmTVL = {
  activeTvlUSD?: string
  activeTvlUSDUpdatedAt?: string
  cakeApr?: string
}

export type FarmData = SerializedFarmConfig & FarmsDynamicDataResult

export type FarmV3Data = ComputedFarmConfigV3 & FarmsDynamicDataResultV2

export type FarmV3DataWithPrice = FarmV3Data & FarmPriceV3

export type FarmV3DataWithPriceTVL = FarmV3DataWithPrice & FarmTVL
export type SerializedFarmV3DataWithPrice = FarmV3Data & FarmPriceV3 & SerializedComputedFarmConfigV3

export interface FarmConfigBaseProps {
  pid: number
  v1pid?: number
  vaultPid?: number
  lpSymbol: string
  lpAddress: Address
  multiplier?: string
  isCommunity?: boolean
  auctionHostingStartSeconds?: number
  auctionHostingEndDate?: string
  dual?: {
    token: SerializedWrappedToken
    aptIncentiveInfo: number
  }
  boosted?: boolean
  allocPoint?: number
  bveCometWrapperAddress?: Address
}

export interface SerializedStableFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
  stableSwapAddress: Address
  infoStableSwapAddress: Address
  stableLpFee?: number
  stableLpFeeRateOfTotalFee?: number
}

export interface SerializedClassicFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export type ComputedFarmConfigV3 = {
  pid: number
  lpSymbol: string
  lpAddress: Address
  boosted?: boolean

  token: Token
  quoteToken: Token
  feeAmount: FeeAmount

  token0: Token
  token1: Token
  isCommunity?: boolean
}

export type SerializedComputedFarmConfigV3 = ComputedFarmConfigV3 & {
  pid: number
  lpSymbol: string
  lpAddress: Address
  boosted?: boolean

  token: SerializedToken
  quoteToken: SerializedToken
  feeAmount: FeeAmount
}

export type FarmConfigV3 = {
  pid: number
  lpAddress: Address
  boosted?: boolean

  token0: Token
  token1: Token
  feeAmount: FeeAmount
  isCommunity?: boolean
}

export type SerializedFarmConfig = SerializedStableFarmConfig | SerializedClassicFarmConfig

export interface SerializedFarmPublicData extends SerializedClassicFarmConfig {
  lpTokenPrice?: string
  lpRewardsApr?: number
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: string
  quoteTokenAmountTotal?: string
  lpTotalInQuoteToken?: string
  lpTotalSupply?: string
  tokenPriceVsQuote?: string
  poolWeight?: string
  boosted?: boolean
  infoStableSwapAddress?: Address
  stableSwapAddress?: string
  stableLpFee?: number
  stableLpFeeRateOfTotalFee?: number
  lpTokenStakedAmount?: string
  bveCometWrapperAddress?: Address
}

export interface AprMap {
  [key: string]: number
}

export function isStableFarm(farmConfig: SerializedFarmConfig): farmConfig is SerializedStableFarmConfig {
  return 'stableSwapAddress' in farmConfig && typeof farmConfig.stableSwapAddress === 'string'
}

export interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  earningsDualTokenBalance?: string
  proxy?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface SerializedBveCometUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  earningsDualTokenBalance?: string
  boosterMultiplier?: number
  boostedAmounts?: string
  boosterContractAddress?: Address
  rewardPerSecond?: number
  startTimestamp?: number
  endTimestamp?: number
  totalLiquidityX?: number
}

export interface SerializedFarm extends SerializedFarmPublicData {
  userData?: SerializedFarmUserData
  bveCometUserData?: SerializedBveCometUserData
  bveCometPublicData?: SerializedBveCometUserData
}

export interface SerializedFarmsV3State {
  data: SerializedFarmPublicData[]
  chainId?: number
  userDataLoaded: boolean
  loadingKeys: Record<string, boolean>
  poolLength?: number
}

export interface SerializedFarmsState {
  data: SerializedFarm[]
  chainId?: number
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  bveCometUserDataLoaded: boolean
  loadingKeys: Record<string, boolean>
  poolLength?: number
  regularveCometPerBlock?: number
  totalRegularAllocPoint: string
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Token
  quoteToken: Token
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
  earningsDualTokenBalance?: BigNumber
  proxy?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}
export interface DeserializedBveCometWrapperUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
  earningsDualTokenBalance?: BigNumber
  boosterMultiplier?: number
  boostedAmounts?: BigNumber
  boosterContractAddress?: Address
  rewardPerSecond?: number
  startTimestamp?: number
  endTimestamp?: number
  isRewardInRange?: boolean
  totalLiquidityX?: number
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  quoteTokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  lpTokenPrice?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: DeserializedFarmUserData
  bveCometUserData?: DeserializedBveCometWrapperUserData
  bveCometPublicData?: DeserializedBveCometWrapperUserData
  boosted?: boolean
  bveCometWrapperAddress?: Address
  isStable?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  stableLpFeeRateOfTotalFee?: number
  lpTokenStakedAmount?: BigNumber
  lpRewardsApr?: number
  dual?: {
    token: Token
    aptIncentiveInfo: number
  }
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  poolLength: number
  regularveCometPerBlock: number
  totalRegularAllocPoint: string
  cakePerBlock?: string
}

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  liquidity?: BigNumber
  dualTokenRewardApr?: number
}

// V3
export interface SerializedFarmsV3Response {
  poolLength: number
  farmsWithPrice: SerializedFarmV3DataWithPrice[]
  cakePerSecond: string
  totalAllocPoint: string
}

export interface FarmsV3Response<T extends FarmV3DataWithPrice = FarmV3DataWithPrice> {
  chainId: number
  poolLength: number
  farmsWithPrice: T[]
  cakePerSecond: string
  totalAllocPoint: string
}

export type IPendingveCometByTokenId = Record<string, bigint>

export interface PositionDetails {
  nonce: bigint
  tokenId: bigint
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
  isStaked?: boolean
  isValidFee?: boolean // 标记fee值是否有效，用于显示问题仓位
}

export interface FarmV3DataWithPriceAndUserInfo extends FarmV3DataWithPriceTVL {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
  pendingveCometByTokenIds: IPendingveCometByTokenId
}

export enum Protocol {
  V2 = 'v2',
  V3 = 'v3',
  STABLE = 'stable',
  V4BIN = 'v4bin',
}

export type FarmBaseConfig = {
  // @deprecated
  pid?: number
  chainId: number
  lpAddress: Address
  token0: Token
  token1: Token
}

export type UniversalFarmConfigStableSwap = {
  protocol: Protocol.STABLE
  stableSwapAddress: Address
  bveCometWrapperAddress: Address
} & FarmBaseConfig

export type UniversalFarmConfigV2 = {
  protocol: Protocol.V2
  bveCometWrapperAddress: Address
} & FarmBaseConfig

export type UniversalFarmConfigV3 = {
  pid: number
  protocol: Protocol.V3
  feeAmount: FeeAmount
} & FarmBaseConfig

/**
 * minimal pool info for a farm
 */
export type UniversalFarmConfig = Prettify<
  UniversalFarmConfigV2 | UniversalFarmConfigStableSwap | UniversalFarmConfigV3
>

// only v2/ss farms have bveCometWrapperAddress
export type BveCometWrapperFarmConfig = {
  chainId: number
  lpAddress: Address
  bveCometWrapperAddress: Address
}
