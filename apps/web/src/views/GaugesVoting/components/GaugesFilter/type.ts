import { ChainId } from '@cometswap/chains'
import { FeeAmount } from '@cometswap/v3-sdk'

export enum OptionsType {
  ByChain = 'byChain',
  ByFeeTier = 'byFeeTier',
  ByType = 'byType',
}

export const enum Gauges {
  Regular = 'Regular Gauges',
  Boosted = 'Boosted Gauges',
  Capped = 'Capped Gauges',
}

export type Filter = {
  [OptionsType.ByChain]: ChainId[]
  [OptionsType.ByFeeTier]: FeeAmount[]
  [OptionsType.ByType]: Gauges[]
}

export type FilterValue = Gauges[] | ChainId[] | FeeAmount[] | Gauges | ChainId | FeeAmount

