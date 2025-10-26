import addresses from 'config/constants/contracts'
import { ChainId } from '@cometswap/chains'

export const poolStartWeekCursors = {
  [addresses.revenueSharingCometPool[ChainId.BSC]]: 1700697600,
  [addresses.revenueSharingCometPool[ChainId.BSC_TESTNET]]: 1700697600,
  [addresses.revenueSharingVeComet[ChainId.BSC]]: 1700697600,
  [addresses.revenueSharingVeComet[ChainId.BSC_TESTNET]]: 1700697600,
} as const

