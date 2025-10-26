import { useTranslation } from '@cometswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, Flex, Skeleton, Text } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'

import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useChainIdByQuery, useChainNameByQuery, useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import { PoolData } from 'state/info/types'
import { styled } from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'

/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool | TVL | Volume 24H |
 *  3 = | # | Pool | TVL |
 *  2 = | # | Pool |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
    & :nth-child(6) {
      display: none;
    }
    & :nth-child(7) {
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

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  totalValueLockedUSD: 'totalValueLockedUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton />
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

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  // const chainName = useChainNameByQuery() // Unused
  const chainPath = useMultiChainPath()
  const stableSwapPath = useStableSwapPath()

  return (
    <LinkWrapper to={`${chainPath}/info${stableSwapPath}/pools/${poolData.address}`}>
      <ResponsiveGrid>
        <Flex>
          <Text>{index + 1}</Text>
        </Flex>
        <Flex alignItems="center">
          <Text>{`${poolData.token0.symbol}/${poolData.token1.symbol}`}</Text>
        </Flex>
        <Text>${formatAmount(poolData.totalValueLockedUSD)}</Text>
        <Text>${formatAmount(poolData.volumeUSD)}</Text>
        <Text>${formatAmount(poolData.volumeUSDWeek)}</Text>
        <Text>${formatAmount(poolData.lpFees24h)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

  // const SORT_FIELD_NAMES = { // Unused
  //   [SORT_FIELD.volumeUSD]: 'Volume 24H',
  //   [SORT_FIELD.totalValueLockedUSD]: 'TVL',
  //   [SORT_FIELD.volumeUSDWeek]: 'Volume 7D',
  //   [SORT_FIELD.lpFees24h]: 'LP reward fees 24H',
  // }

interface PoolTableProps {
  poolDatas: PoolData[]
  loading?: boolean
  maxItems?: number
}

const PoolTable: React.FC<React.PropsWithChildren<PoolTableProps>> = ({
  poolDatas,
  loading = false,
  maxItems = ITEMS_PER_INFO_TABLE_PAGE,
}) => {
  const [sortField, setSortField] = useState(SORT_FIELD.totalValueLockedUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

    // const chainId = useChainIdByQuery() // Unused

  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
  }, [maxItems, poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [poolDatas, maxItems, page, sortDirection, sortField])

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

  if (!poolDatas) {
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
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          {t('Pool')} {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.totalValueLockedUSD)}
          textTransform="uppercase"
        >
          {t('TVL')} {arrow(SORT_FIELD.totalValueLockedUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          {t('Volume 24H')} {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          {t('Volume 7D')} {arrow(SORT_FIELD.volumeUSDWeek)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.lpFees24h)}
          textTransform="uppercase"
        >
          {t('LP reward fees 24H')} {arrow(SORT_FIELD.lpFees24h)}
        </ClickableColumnHeader>
      </ResponsiveGrid>

      <Break />
      {loading && <TableLoader />}
      {!loading &&
        sortedPools.map((poolData, i) => {
          if (poolData) {
            return (
              <Fragment key={poolData.address}>
                <DataRow index={(page - 1) * maxItems + i} poolData={poolData} />
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

          <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>

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

export default PoolTable