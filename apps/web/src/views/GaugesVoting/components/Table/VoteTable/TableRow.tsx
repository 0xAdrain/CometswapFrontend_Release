import { GAUGE_TYPE_NAMES, GaugeType } from '@cometswap/gauges'
import { useTranslation } from '@cometswap/localization'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Tag, Text } from '@cometswap/uikit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useMemo, useState } from 'react'
import { stringify } from 'viem'
import { DebugTooltips, Tooltips } from 'views/CometStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CometStaking/hooks/useCurrentBlockTimestamp'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { usePositionManagerName } from 'views/GaugesVoting/hooks/usePositionManagerName'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { PositionManagerLogo } from '../../PositionManagerLogo'
import { VRow } from '../styled'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { DEFAULT_VOTE, RowProps } from './types'

dayjs.extend(relativeTime)

const debugFormat = (unix?: bigint | number) => {
  if (!unix) return ''
  return dayjs.unix(Number(unix)).format('YYYY-MM-DD HH:mm:ss')
}

export const TableRow: React.FC<RowProps> = ({ data, submitted, vote = { ...DEFAULT_VOTE }, onChange }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { cometLockedAmount } = useVeCometLockStatus()
  const { managerName } = usePositionManagerName(data)
  const cometLocked = useMemo(() => cometLockedAmount > 0n, [cometLockedAmount])
  const userVote = useUserVote(data, submitted)
  const {
    currentVoteWeight,
    currentVotePercent,
    previewVoteWeight,
    voteValue,
    voteLocked,
    willUnlock,
    proxyCometBalance,
    changeHighlight,
  } = useRowVoteState({
    data,
    vote,
    onChange,
  })
  const onMax = () => {
    onChange(vote, true)
  }

  return (
    <VRow data-gauge-hash={data.hash}>
      <FlexGap alignItems="center" gap="13px">
        <DebugTooltips
          content={
            <pre>
              {stringify(
                {
                  ...userVote,
                  currentTimestamp: debugFormat(currentTimestamp),
                  nativeLasVoteTime: debugFormat(userVote?.nativeLastVoteTime),
                  proxyLastVoteTime: debugFormat(userVote?.proxyLastVoteTime),
                  lastVoteTime: debugFormat(userVote?.lastVoteTime),
                  end: debugFormat(userVote?.end),
                  proxyEnd: debugFormat(userVote?.proxyEnd),
                  nativeEnd: debugFormat(userVote?.nativeEnd),
                  proxyCometBalance: proxyCometBalance?.toString(),
                  willUnlock,
                  voteLocked,
                  cometLocked,
                },
                undefined,
                2,
              )}
            </pre>
          }
        >
          <GaugeTokenImage gauge={data} />
        </DebugTooltips>
        <Flex flexDirection="column">
          <Text fontWeight={600} fontSize={16}>
            {data.pairName}
          </Text>
          {data.type === GaugeType.ALM ? (
            <Flex alignItems="center">
              <PositionManagerLogo manager={managerName} />
              <Text fontSize={14} color="textSubtle">
                {managerName}
              </Text>
            </Flex>
          ) : null}
          {data.killed && (
            <span
              style={{
                color: '#FFB237',
              }}
            >
              {t('Deleted')}
            </span>
          )}
        </Flex>
      </FlexGap>

      <FlexGap gap="5px" alignItems="center">
        <NetworkBadge chainId={Number(data.chainId)} />
        {/* {[GaugeType.V3, GaugeType.V2].includes(data.type) ? ( */}
        {GaugeType.V3 === data.type || GaugeType.V2 === data.type ? (
          <Tag outline variant="secondary">
            {feeTierPercent(data.feeTier)}
          </Tag>
        ) : null}

        <Tag variant="secondary">{data ? GAUGE_TYPE_NAMES[data.type] : ''}</Tag>
      </FlexGap>
      <Flex alignItems="center" justifyContent="center" pl={16}>
        <Text bold>{currentVoteWeight}</Text>
        <Text>{currentVotePercent ? ` (${currentVotePercent}%)` : null}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" pr="25px">
        {voteLocked ? (
          <Tooltips
            content={t(
              'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
              {
                distance: userVote?.lastVoteTime
                  ? dayjs.unix(Number(userVote?.lastVoteTime)).add(10, 'day').from(dayjs.unix(currentTimestamp), true)
                  : '',
              },
            )}
          >
            <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
          </Tooltips>
        ) : null}
        <Text
          bold={changeHighlight}
          color={voteLocked || willUnlock || !cometLocked ? (changeHighlight ? 'textSubtle' : 'textDisabled') : ''}
        >
          {previewVoteWeight} veCOMET
        </Text>
      </Flex>
      <Flex>
        <PercentInput
          disabled={voteLocked || willUnlock || !cometLocked}
          inputProps={{ disabled: voteLocked || willUnlock || !cometLocked }}
          onMax={onMax}
          value={voteValue}
          onUserInput={(v) => onChange({ ...vote!, power: v })}
        />
      </Flex>
    </VRow>
  )
}

export const ExpandRow: React.FC<{
  onCollapse?: () => void
  text?: string
  expandedText?: string
}> = ({ onCollapse, text, expandedText }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded((prev) => !prev)
    onCollapse?.()
  }, [onCollapse])
  const textToDisplay = expanded ? expandedText || t('Collapse') : text || t('Expand')

  return (
    <Flex alignItems="center" justifyContent="center" py="8px">
      <Button
        onClick={handleCollapse}
        variant="text"
        endIcon={expanded ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
      >
        {textToDisplay}
      </Button>
    </Flex>
  )
}

