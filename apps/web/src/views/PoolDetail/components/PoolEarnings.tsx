import { useTranslation } from '@cometswap/localization'
import { AutoColumn, Skeleton, Text } from '@cometswap/uikit'
import { formatNumber } from '@cometswap/utils/formatBalance'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useV2CometEarning, useV3CometEarningsByPool } from 'views/universalFarms/hooks/useVeCometEarning'

type PoolEarningsProps = {
  earningsBusd: number
  earningsAmount: number
  loading?: boolean
}

const PoolEarnings: React.FC<PoolEarningsProps> = ({ earningsBusd, earningsAmount, loading }) => {
  const { t } = useTranslation()
  if (loading) {
    return (
      <AutoColumn gap="sm">
        <Skeleton height={24} width={188} />
        <Skeleton height={36} width={100} />
      </AutoColumn>
    )
  }
  return (
    <AutoColumn>
      <Text color="secondary" fontWeight={600} textTransform="uppercase">
        {t('total farming earning')}
      </Text>
      <Text as="h3" fontWeight={600} fontSize={24}>
        ${formatNumber(earningsBusd, 0, 4)}
      </Text>
      <Text color="secondary" fontSize={12}>
        {formatNumber(earningsAmount)} COMET
      </Text>
    </AutoColumn>
  )
}

export const V2PoolEarnings: React.FC<{ pool: PoolInfo | null | undefined }> = ({ pool }) => {
  const { earningsBusd, earningsAmount, isLoading } = useV2CometEarning(pool)

  return <PoolEarnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} loading={isLoading} />
}

export const V3PoolEarnings: React.FC<{ pool: PoolInfo | null | undefined }> = ({ pool }) => {
  const { earningsBusd, earningsAmount, isLoading } = useV3CometEarningsByPool(pool)
  return <PoolEarnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} loading={isLoading} />
}

