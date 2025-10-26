import { ArrowBackIcon, ArrowForwardIcon, Flex, Link, Skeleton, Text, useMatchBreakpoints } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'

import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useChainNameByQuery, useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import { Transaction, TransactionType } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo } from 'components/Logo'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'

/**
 *  Columns on different layouts
 *  5 = | Type | Value | Token Amount | Token Amount | Account | Time |
 *  4 = | Type | Value | Token Amount | Token Amount | Time |
 *  3 = | Type | Value | Token Amount | Time |
 *  2 = | Type | Value | Time |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 1.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 1.5fr repeat(4, 1fr);
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 1.5fr repeat(2, 1fr) 1fr;
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1.5fr 1fr 1fr;
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
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
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

const formatTime = (unix: string) => {
  const now = Date.now() / 1000
  const secondsAgo = now - parseInt(unix)
  const minutesAgo = Math.floor(secondsAgo / 60)
  const hoursAgo = Math.floor(minutesAgo / 60)
  const daysAgo = Math.floor(hoursAgo / 24)

  if (daysAgo > 0) {
    return `${daysAgo}d ago`
  }
  if (hoursAgo > 0) {
    return `${hoursAgo}h ago`
  }
  if (minutesAgo > 0) {
    return `${minutesAgo}m ago`
  }
  return 'Just now'
}

const DataRow = ({ transaction, index }: { transaction: Transaction; index: number }) => {
  const { isMobile } = useMatchBreakpoints()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const stableSwapPath = useStableSwapPath()

  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol

  const getTransactionType = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SWAP:
        return 'Swap'
      case TransactionType.MINT:
        return 'Add'
      case TransactionType.BURN:
        return 'Remove'
      default:
        return 'Unknown'
    }
  }

  return (
    <ResponsiveGrid>
      <Flex alignItems="center">
        <Text color={transaction.type === TransactionType.SWAP ? 'primary' : transaction.type === TransactionType.MINT ? 'success' : 'failure'}>
          {getTransactionType(transaction.type)}
        </Text>
      </Flex>
      <Text fontWeight="600">${formatAmount(transaction.amountUSD)}</Text>
      <Flex alignItems="center">
        <ResponsiveLogo address={transaction.token0Address} />
        <Text ml="8px" fontSize={isMobile ? '14px' : '16px'}>
          {formatAmount(abs0)} {transaction.token0Symbol}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <ResponsiveLogo address={transaction.token1Address} />
        <Text ml="8px" fontSize={isMobile ? '14px' : '16px'}>
          {formatAmount(abs1)} {transaction.token1Symbol}
        </Text>
      </Flex>
      <Link external href={`https://bscscan.com/address/${transaction.sender}`} color="primary">
        {transaction.sender.slice(0, 6)}...{transaction.sender.slice(38, 42)}
      </Link>
      <Text>{formatTime(transaction.timestamp)}</Text>
    </ResponsiveGrid>
  )
}

interface TransactionTableProps {
  transactions: Transaction[]
  loading?: boolean
  maxItems?: number
}

const TransactionTable: React.FC<React.PropsWithChildren<TransactionTableProps>> = ({
  transactions,
  loading = false,
  maxItems = ITEMS_PER_INFO_TABLE_PAGE,
}) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (transactions.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(transactions.length / maxItems) + extraPages)
  }, [maxItems, transactions])

  const sortedTransactions = useMemo(() => {
    return transactions
      ? transactions
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Transaction] > b[sortField as keyof Transaction]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [transactions, maxItems, page, sortDirection, sortField])

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

  if (!transactions) {
    return <Skeleton />
  }

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          Action
        </Text>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.amountUSD)}
          textTransform="uppercase"
        >
          Total Value {arrow(SORT_FIELD.amountUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.amountToken0)}
          textTransform="uppercase"
        >
          Token Amount {arrow(SORT_FIELD.amountToken0)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.amountToken1)}
          textTransform="uppercase"
        >
          Token Amount {arrow(SORT_FIELD.amountToken1)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.sender)}
          textTransform="uppercase"
        >
          Account {arrow(SORT_FIELD.sender)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.timestamp)}
          textTransform="uppercase"
        >
          Time {arrow(SORT_FIELD.timestamp)}
        </ClickableColumnHeader>
      </ResponsiveGrid>

      <Break />
      {loading && <TableLoader />}
      {!loading &&
        sortedTransactions.map((transaction, i) => {
          if (transaction) {
            return (
              <Fragment key={transaction.hash || `transaction-${(page - 1) * maxItems + i}`}>
                <DataRow index={(page - 1) * maxItems + i} transaction={transaction} />
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

export default TransactionTable