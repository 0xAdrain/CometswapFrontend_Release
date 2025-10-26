import { ChainId } from '@cometswap/sdk'

// List of official token lists
export const OFFICIAL_LISTS = [
  'https://tokens.cometswap.finance/cometswap-default.json',
  'https://tokens.cometswap.finance/cometswap-extended.json',
]

// List of community token lists
export const COMMUNITY_LISTS = [
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
]

// Default list of lists
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...OFFICIAL_LISTS,
  ...COMMUNITY_LISTS,
]

// Unsupported list URLs
export const UNSUPPORTED_LIST_URLS: string[] = []

// Default active list URLs
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  'https://tokens.cometswap.finance/cometswap-default.json',
]

// Chain-specific token lists
export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
  [ChainId.BSC]: [
    'https://tokens.cometswap.finance/cometswap-default.json',
    'https://tokens.cometswap.finance/cometswap-extended.json',
  ],
  [ChainId.ETHEREUM]: [
    'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
    'https://tokens.coingecko.com/uniswap/all.json',
  ],
}

// Warning list for potentially dangerous tokens
export const WARNING_LIST_URLS: string[] = [
  'https://tokens.cometswap.finance/cometswap-warning.json',
]

// List update interval (in milliseconds)
export const LIST_UPDATE_INTERVAL = 1000 * 60 * 10 // 10 minutes

// Maximum number of lists to allow
export const MAX_LIST_COUNT = 20