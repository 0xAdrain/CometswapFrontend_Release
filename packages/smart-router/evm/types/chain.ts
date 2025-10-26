import { Token } from '@cometswap/sdk'
import { ChainId } from '@cometswap/chains'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
