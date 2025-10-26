import { ChainId } from '@cometswap/chains'

// Time constants
export const WEEK = 7 * 24 * 60 * 60 // 7 days in seconds
export const YEAR = 365 * 24 * 60 * 60 // 365 days in seconds
export const MAX_LOCK_DURATION = 4 * YEAR // 4 years in seconds

// Comet staking constants
export const COMET_PER_BLOCK = 40
export const COMET_PER_YEAR = 10512000

// VeComet constants
export const MIN_LOCK_DURATION = WEEK
export const UNLOCK_FREE_DURATION = 2 * WEEK

// Pool constants
export const BOOST_PRECISION = 100
export const MAX_BOOST_PRECISION = 100

// Address mappings by chain
export const COMET_VAULT_ADDRESSES = {
  [ChainId.BSC]: '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
  [ChainId.BSC_TESTNET]: '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
} as const

export const VE_COMET_ADDRESSES = {
  [ChainId.BSC]: '0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c',
  [ChainId.BSC_TESTNET]: '0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c',
} as const

export const REVENUE_SHARING_POOL_ADDRESSES = {
  [ChainId.BSC]: '0xBCfccbde45cE874adCB698cC183deBcF17952812',
  [ChainId.BSC_TESTNET]: '0xBCfccbde45cE874adCB698cC183deBcF17952812',
} as const

// Helper functions
export const getCometVaultAddress = (chainId?: number) => {
  if (!chainId) return COMET_VAULT_ADDRESSES[ChainId.BSC]
  return COMET_VAULT_ADDRESSES[chainId as keyof typeof COMET_VAULT_ADDRESSES] || COMET_VAULT_ADDRESSES[ChainId.BSC]
}

export const getVeCometAddress = (chainId?: number) => {
  if (!chainId) return VE_COMET_ADDRESSES[ChainId.BSC]
  return VE_COMET_ADDRESSES[chainId as keyof typeof VE_COMET_ADDRESSES] || VE_COMET_ADDRESSES[ChainId.BSC]
}

export const getRevenueSharingPoolAddress = (chainId?: number) => {
  if (!chainId) return REVENUE_SHARING_POOL_ADDRESSES[ChainId.BSC]
  return REVENUE_SHARING_POOL_ADDRESSES[chainId as keyof typeof REVENUE_SHARING_POOL_ADDRESSES] || REVENUE_SHARING_POOL_ADDRESSES[ChainId.BSC]
}




