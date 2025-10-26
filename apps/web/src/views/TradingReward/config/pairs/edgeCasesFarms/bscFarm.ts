import { defineFarmV3Configs } from '@cometswap/farms/src/defineFarmV3Configs'
import { bscTokens } from '@cometswap/tokens'
import { FeeAmount } from '@cometswap/v3-sdk'

export const tradingRewardBscV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0xfab21Cb9467e9BaDd22A2dE57BCDE5F53D925973',
    token0: bscTokens.usdt,
    token1: bscTokens.bnx,
    feeAmount: FeeAmount.LOW,
  },
])
