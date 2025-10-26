import { ArrowBackIcon, ArrowForwardIcon, Flex, Skeleton, Text, useMatchBreakpoints } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'

import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo } from 'components/Logo'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'

/**
 *  Columns on different layouts
 *  5 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  4 = | # | Name | Price | Price Change | Volume 24H |
 *  3 = | # | Name | Price | Price Change |
 *  2 = | # | Name | Price |
 *  1 = | # | Name |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(4, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 2fr repeat(1, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const ResponsiveLogo = styled(CurrencyLogo)`
  border-radius: 50%;
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  totalValueLockedUSD: 'totalValueLockedUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
)

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  const { isMobile } = useMatchBreakpoints()
  // const chainName = useChainNameByQuery() // Unused
  const chainPath = useMultiChainPath()
  const stableSwapPath = useStableSwapPath()

  return (
    <LinkWrapper to={`${chainPath}/info${stableSwapPath}/tokens/${tokenData.address}`}>
      <ResponsiveGrid>
        <Flex>
          <Text>{index + 1}</Text>
        </Flex>
        <Flex alignItems="center">
          <ResponsiveLogo address={tokenData.address} />
          <Text ml="8px" fontWeight="600">
            {tokenData.symbol}
          </Text>
          <Text ml="8px" color="textSubtle" fontSize={isMobile ? '14px' : '16px'}>
            {tokenData.name}
          </Text>
        </Flex>
        <Text fontWeight="600">${formatAmount(tokenData.priceUSD, { notation: 'standard' })}</Text>
        <Text color={tokenData.priceUSDChange > 0 ? 'success' : 'failure'}>
          {tokenData.priceUSDChange.toFixed(2)}%
        </Text>
        <Text fontWeight="600">${formatAmount(tokenData.volumeUSD)}</Text>
        <Text fontWeight="600">${formatAmount(tokenData.totalValueLockedUSD)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

interface TokenTableProps {
  tokenDatas: TokenData[]
  loading?: boolean
  maxItems?: number
}

const TokenTable: React.FC<React.PropsWithChildren<TokenTableProps>> = ({
  tokenDatas,
  loading = false,
  maxItems = ITEMS_PER_INFO_TABLE_PAGE,
}) => {
  const [sortField, setSortField] = useState(SORT_FIELD.totalValueLockedUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (tokenDatas.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  if (!tokenDatas) {
    return <Skeleton />
  }

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.name)}
          textTransform="uppercase"
        >
          Name {arrow(SORT_FIELD.name)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.priceUSD)}
          textTransform="uppercase"
        >
          Price {arrow(SORT_FIELD.priceUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
          textTransform="uppercase"
        >
          Price Change {arrow(SORT_FIELD.priceUSDChange)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          Volume 24H {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.totalValueLockedUSD)}
          textTransform="uppercase"
        >
          TVL {arrow(SORT_FIELD.totalValueLockedUSD)}
        </ClickableColumnHeader>
      </ResponsiveGrid>

      <Break />
      {loading && <TableLoader />}
      {!loading &&
        sortedTokens.map((tokenData, i) => {
          if (tokenData) {
            return (
              <Fragment key={tokenData.address}>
                <DataRow index={(page - 1) * maxItems + i} tokenData={tokenData} />
                <Break />
              </Fragment>
            )
          }
          return null
        })}
      {!loading && (
        <PageButtons>
          <Arrow
            onClick={() => {
              setPage(page === 1 ? page : page - 1)
            }}
          >
            <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>

          <Text>Page {page} of {maxPage}</Text>

          <Arrow
            onClick={() => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </PageButtons>
      )}
    </TableWrapper>
  )
}

export default TokenTable