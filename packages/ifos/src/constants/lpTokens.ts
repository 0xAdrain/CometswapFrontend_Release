import { ERC20Token, ChainId } from '@cometswap/sdk'

export const COMET_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export const cakeBnbLpToken = new ERC20Token(ChainId.BSC, COMET_BNB_LP_MAINNET, 18, 'COMET-BNB LP')
