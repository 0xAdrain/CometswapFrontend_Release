import { useTranslation } from '@cometswap/localization'
import { Text, Th } from '@cometswap/uikit'
import { VHeader } from '../styled'

export const TableHeader: React.FC<{
  count?: number
}> = ({ count = 0 }) => {
  const { t } = useTranslation()
  return (
    <VHeader style={{ borderTop: 'none' }}>
      <Th style={{ textAlign: 'left' }}>
        <Text color="secondary" textTransform="uppercase" fontWeight={600}>
          {t('gauges')}({count})
        </Text>
      </Th>
      <Th style={{ textAlign: 'left' }}>
        <Text color="secondary" textTransform="uppercase" fontWeight={600}>
          {t('chain & strategy')}
        </Text>
      </Th>
      <Th>
        <Text color="secondary" textTransform="uppercase" fontWeight={600}>
          {t('current votes')}
        </Text>
      </Th>
      <Th>
        <Text color="secondary" textTransform="uppercase" fontWeight={600} pr={20}>
          {t('preview votes')}
        </Text>
      </Th>
      <Th>
        <Text color="secondary" textTransform="uppercase" fontWeight={600} textAlign="right">
          {t('My Comet %')}
        </Text>
      </Th>
    </VHeader>
  )
}

