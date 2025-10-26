// import { ChainId } from '@cometswap/chains'

export const SUPPORTED_CHAIN_IDS = [] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
