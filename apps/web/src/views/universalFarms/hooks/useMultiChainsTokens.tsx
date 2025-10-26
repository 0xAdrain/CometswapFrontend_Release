import { useAtom } from 'jotai'
import flatMap from 'lodash/flatMap'
import uniqWith from 'lodash/uniqWith'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { SUGGESTED_BASES } from 'config/constants/exchange'
import { ChainId, ERC20Token, Native } from '@cometswap/sdk'
import type { TokenInfo } from '@cometswap/token-lists'
import {
  COMET_ARB_DEFAULT,
  COMET_BASE_DEFAULT,
  COMET_BSC_MM,
  COMET_ETH_DEFAULT,
  COMET_ETH_MM,
  COMET_EXTENDED,
  COMET_LINEA_DEFAULT,
  COMET_OPBNB_DEFAULT,
  COMET_POLYGON_ZKEVM_DEFAULT,
  COMET_ZKSYNC_DEFAULT,
} from 'config/constants/lists'
import { useOrderChainIds } from './useMultiChains'

const BSC_URLS = [COMET_EXTENDED, COMET_BSC_MM]
const ETH_URLS = [COMET_ETH_DEFAULT, COMET_ETH_MM]
const ZKSYNC_URLS = [COMET_ZKSYNC_DEFAULT]
const POLYGON_ZKEVM_URLS = [COMET_POLYGON_ZKEVM_DEFAULT]
const ARBITRUM_URLS = [COMET_ARB_DEFAULT]
const LINEA_URLS = [COMET_LINEA_DEFAULT]
const BASE_URLS = [COMET_BASE_DEFAULT]
const OPBNB_URLS = [COMET_OPBNB_DEFAULT]

export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
  [ChainId.BSC]: BSC_URLS,
  [ChainId.ETHEREUM]: ETH_URLS,
  [ChainId.ZKSYNC]: ZKSYNC_URLS,
  [ChainId.POLYGON_ZKEVM]: POLYGON_ZKEVM_URLS,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_URLS,
  [ChainId.LINEA]: LINEA_URLS,
  [ChainId.BASE]: BASE_URLS,
  [ChainId.OPBNB]: OPBNB_URLS,
}

export const useTokensFromUrls = (urls: string[]) => {
  const [lists] = useAtom(selectorByUrlsAtom)
  return useMemo(() => {
    const tokenInfos = flatMap(urls, (url) => lists[url]?.current?.tokens).filter(Boolean) as TokenInfo[]
    return tokenInfos.map(
      ({ chainId, address, decimals, symbol, name }) => new ERC20Token(chainId, address, decimals, symbol, name),
    )
  }, [lists, urls])
}

export const useMultiChainsTokens = () => {
  const { orderedChainIds } = useOrderChainIds()
  const suggestedTokens = useMemo(
    () => flatMap(orderedChainIds, (id) => [Native.onChain(id).wrapped].concat(SUGGESTED_BASES[id])),
    [orderedChainIds],
  )
  const listUrls = useMemo(
    () =>
      [
        ...orderedChainIds.map((chainId) => MULTI_CHAIN_LIST_URLS[chainId]?.[0]),
        ...orderedChainIds.map((chainId) => MULTI_CHAIN_LIST_URLS[chainId]?.[1]),
      ].filter(Boolean),
    [orderedChainIds],
  )
  const tokenList = useTokensFromUrls(listUrls)
  return useMemo(() => uniqWith(suggestedTokens.concat(tokenList), (a, b) => a.equals(b)), [tokenList, suggestedTokens])
}

