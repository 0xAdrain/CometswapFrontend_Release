import { ChainId } from '@cometswap/chains'

import { COMET_FLEXIBLE_SIDE_VAULT, COMET_VAULT } from '../constants/contracts'
import { getContractAddress } from '../utils'

export function getCometFlexibleSideVaultAddress(chainId: ChainId) {
  return getContractAddress(COMET_FLEXIBLE_SIDE_VAULT, chainId)
}

export function getCometVaultAddress(chainId: ChainId) {
  return getContractAddress(COMET_VAULT, chainId)
}
