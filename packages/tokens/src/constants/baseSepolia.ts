import { ChainId } from '@cometswap/chains'
import { WETH9 } from '@cometswap/sdk'
import { USDC } from './common'

export const baseSepoliaTokens = {
  weth: WETH9[ChainId.BASE_SEPOLIA],
  usdc: USDC[ChainId.BASE_SEPOLIA],
}
