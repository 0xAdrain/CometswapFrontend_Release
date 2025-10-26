import { ChainId, WETH9 } from '@cometswap/sdk'
import { USDC } from './common'

export const sepoliaTokens = {
  weth: WETH9[ChainId.SEPOLIA],
  usdc: USDC[ChainId.SEPOLIA],
}
