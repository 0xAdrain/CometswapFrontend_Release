import { Protocol } from '@cometswap/farms'
import { useTheme } from '@cometswap/hooks'
import { useTranslation } from '@cometswap/localization'
import { Currency, CurrencyAmount, Token } from '@cometswap/swap-sdk-core'
import { FeeTier, Flex, Row, Skeleton, Tag, Text, useMatchBreakpoints } from '@cometswap/uikit'
import { formatNumber } from '@cometswap/utils/formatBalance'
import { DoubleCurrencyLogo, FiatNumberDisplay } from '@cometswap/widgets-internal'
import { RangeTag } from 'components/RangeTag'
import React, { memo, useMemo } from 'react'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useV2CometEarning, useV3CometEarning } from 'views/universalFarms/hooks/useVeCometEarning'
import { MerklTag } from 'components/Merkl/MerklTag'
import { PoolGlobalAprButton, V2PoolPositionAprButton, V3PoolPositionAprButton } from '../PoolAprButton'

const displayTokenReserve = (amount?: CurrencyAmount<Token>) => {
  const minimumFractionDigits = Math.min(amount?.currency.decimals ?? 0, 6)
  const quantity = amount && !amount.equalTo(0) ? amount.toFixed(minimumFractionDigits) : '0'
  const symbol = amount?.currency.symbol ?? '-'

  return `${quantity} ${symbol}`
}

export type PositionInfoProps = {
  chainId: number
  currency0?: Currency
  currency1?: Currency
  removed: boolean
  outOfRange: boolean
  desc?: React.ReactNode
  link?: string
  tokenId?: bigint
  fee: number
  feeTierBase?: number
  isStaked?: boolean
  protocol: Protocol
  totalPriceUSD: number
  amount0?: CurrencyAmount<Token>
  amount1?: CurrencyAmount<Token>
  pool?: PoolInfo | null
  detailMode?: boolean
  userPosition?: PositionDetail | V2LPDetail | StableLPDetail
}

export const PositionInfo = memo(
  ({
    currency0,
    currency1,
    removed,
    outOfRange,
    desc,
    tokenId,
    fee,
    feeTierBase,
    isStaked,
    protocol,
    totalPriceUSD,
    amount0,
    amount1,
    pool,
    userPosition,
    detailMode,
  }: PositionInfoProps) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { isMobile, isTablet } = useMatchBreakpoints()

    const title = useMemo(
      () =>
        isTablet || isMobile ? (
          <DetailInfoTitle $isMobile>
            <Row>
              <DoubleCurrencyLogo
                size={24}
                currency0={currency0}
                currency1={currency1}
                showChainLogo
                innerMargin="-10px"
              />
              <FeeTier type={protocol} fee={fee} denominator={feeTierBase} />
            </Row>
            <Row>
              <Text bold>{`${currency0?.symbol} / ${currency1?.symbol} LP`}</Text>
              {tokenId ? <Text color="textSubtle">(#{tokenId.toString()})</Text> : null}
            </Row>
            <Row>
              {isStaked && (
                <Tag variant="primary60" mr="8px">
                  {t('Farming')}
                </Tag>
              )}
              {protocol === Protocol.V3 && <RangeTag lowContrast removed={removed} outOfRange={outOfRange} />}
              <MerklTag poolAddress={pool?.lpAddress} />
            </Row>
          </DetailInfoTitle>
        ) : (
          <DetailInfoTitle>
            <Text bold>{`${currency0?.symbol} / ${currency1?.symbol} LP`}</Text>
            {tokenId ? <Text color="textSubtle">(#{tokenId.toString()})</Text> : null}
            <FeeTier type={protocol} fee={fee} denominator={feeTierBase} />
            <TagCell>
              {isStaked && (
                <Tag variant="primary60" mr="8px">
                  {t('Farming')}
                </Tag>
              )}
              {protocol === Protocol.V3 && <RangeTag lowContrast removed={removed} outOfRange={outOfRange} />}
              <MerklTag poolAddress={pool?.lpAddress} />
            </TagCell>
          </DetailInfoTitle>
        ),
      [
        feeTierBase,
        currency0,
        currency1,
        fee,
        isMobile,
        isTablet,
        isStaked,
        outOfRange,
        protocol,
        removed,
        t,
        tokenId,
        pool,
      ],
    )

    return (
      <>
        {title}
        <DetailInfoDesc>
          {desc}
          <Row gap="sm">
            <FiatNumberDisplay
              prefix="~"
              value={totalPriceUSD}
              style={{ color: theme.colors.textSubtle, fontSize: '12px' }}
              showFullDigitsTooltip={false}
            />
            ({displayTokenReserve(amount0)} / {displayTokenReserve(amount1)})
          </Row>
          <Row gap="8px">
            <DetailInfoLabel>APR: </DetailInfoLabel>
            {pool ? (
              userPosition ? (
                pool.protocol === Protocol.V3 ? (
                  <V3PoolPositionAprButton pool={pool} userPosition={userPosition as PositionDetail} />
                ) : (
                  <V2PoolPositionAprButton pool={pool} userPosition={userPosition as V2LPDetail | StableLPDetail} />
                )
              ) : (
                <PoolGlobalAprButton pool={pool} detailMode={detailMode} />
              )
            ) : (
              <Skeleton width={60} />
            )}
          </Row>
          {isStaked ? (
            protocol === Protocol.V3 && pool?.chainId ? (
              <V3Earnings tokenId={tokenId} chainId={pool?.chainId} />
            ) : (
              <V2Earnings pool={pool} />
            )
          ) : null}
        </DetailInfoDesc>
      </>
    )
  },
)

const Earnings: React.FC<{ earningsAmount?: number; earningsBusd?: number }> = ({
  earningsAmount = 0,
  earningsBusd = 0,
}) => {
  const { t } = useTranslation()
  return (
    earningsBusd > 0 && (
      <Row gap="8px">
        <DetailInfoLabel>
          {t('COMETearned')}: {earningsAmount} (~${formatNumber(earningsBusd)})
        </DetailInfoLabel>
      </Row>
    )
  )
}

const V2Earnings = ({ pool }: { pool: PoolInfo | null | undefined }) => {
  const { earningsAmount, earningsBusd } = useV2CometEarning(pool)
  return <Earnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} />
}

const V3Earnings = ({ tokenId, chainId }: { tokenId?: bigint; chainId: number }) => {
  const { earningsAmount, earningsBusd } = useV3CometEarning(
    useMemo(() => (tokenId ? [tokenId] : []), [tokenId]),
    chainId,
  )
  return <Earnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} />
}

const DetailInfoTitle = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`

const TagCell = styled(Flex)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 16px;
`

const DetailInfoDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
`

const DetailInfoLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 600;
  font-size: 12px;
`

