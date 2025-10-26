import { defineFarmV3Configs } from '@cometswap/farms/src/defineFarmV3Configs'
import { lineaTokens } from '@cometswap/tokens'
import { FeeAmount } from '@cometswap/v3-sdk'

export const tradingRewardLineaV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0xE817A59F8A030544Ff65F47536abA272F6d63059',
    token0: lineaTokens.comet,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
])
