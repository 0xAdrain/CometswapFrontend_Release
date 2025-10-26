import type { Chain } from 'viem'
import { bsc } from 'viem/chains'

export const BSCMevGuardChain = {
  ...bsc,
  rpcUrls: {
    default: {
      http: ['https://bscrpc.cometswap.finance'],
    },
  },
  name: 'CometSwap MEV Guard',
} satisfies Chain

