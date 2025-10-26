import { ChainId } from '@cometswap/chains'
import { supportedChainId } from '@cometswap/farms'

export const SUPPORT_ONLY_BSC = [ChainId.BSC]
export const SUPPORT_FARMS = supportedChainId
export const LIQUID_STAKING_SUPPORTED_CHAINS = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.BSC_TESTNET,
  ChainId.ARBITRUM_GOERLI,
]
export const FIXED_STAKING_SUPPORTED_CHAINS = [ChainId.BSC]

export const V3_MIGRATION_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.ETHEREUM]
export const V2_BCOMET_MIGRATION_SUPPORTED_CHAINS = [ChainId.BSC]

export const SUPPORT_COMET_STAKING = [ChainId.BSC, ChainId.BSC_TESTNET]

