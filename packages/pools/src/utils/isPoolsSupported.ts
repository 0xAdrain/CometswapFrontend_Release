import { ChainId } from '@cometswap/chains'

import {
  SupportedChainId,
  SUPPORTED_CHAIN_IDS,
  CometVaultSupportedChainId,
  COMET_VAULT_SUPPORTED_CHAINS,
} from '../constants/supportedChains'

export function isPoolsSupported(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}

export function isCometVaultSupported(chainId?: ChainId): chainId is CometVaultSupportedChainId {
  return !!chainId && (COMET_VAULT_SUPPORTED_CHAINS as readonly ChainId[]).includes(chainId)
}
