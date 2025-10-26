import { useTranslation } from '@cometswap/localization'
import { AutoRow, BalanceInput, BalanceInputProps, Box, Button, FlexGap, Image, Text } from '@cometswap/uikit'
import { MAX_VECOMET_LOCK_WEEKS } from 'config/constants/Comet'
import { useAtom, useAtomValue } from 'jotai'
import React, { useCallback, useMemo } from 'react'
import { cometLockWeeksAtom } from 'state/Comet/atoms'
import styled from 'styled-components'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useMaxUnlockWeeks } from '../hooks/useMaxUnlockTime'
import { useVeCometLockStatus } from '../hooks/useVeCometUserInfo'
import { LockWeeksDataSet } from './DataSet'

const weeks = [
  {
    value: 1,
    label: '1W',
  },
  {
    value: 4,
    label: '1M',
  },
  {
    value: 26,
    label: '6M',
  },
  {
    value: 52,
    label: '1Y',
  },
  {
    value: 208,
    label: '4Y',
  },
]

const ButtonBlocked = styled(Button)`
  flex: 1;
  white-space: nowrap;
`

const LockImageElement = React.memo(() => (
  <Box width={40} mr={12}>
    <Image src="/images/comet-staking/lock.png" height={37} width={34} />
  </Box>
))

const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const { cometLockExpired, cakeUnlockTime } = useVeCometLockStatus()
  const showMax = useMemo(() => (cometLockExpired ? false : cakeUnlockTime > 0), [cometLockExpired, cakeUnlockTime])
  const weekOptions = useMemo(() => {
    return showMax ? weeks.slice(0, weeks.length - 1) : weeks
  }, [showMax])
  const maxUnlockWeeks = useMaxUnlockWeeks(MAX_VECOMET_LOCK_WEEKS, cometLockExpired ? 0 : cakeUnlockTime)
  const onInput = useCallback(
    (v: string) => {
      if (Number(v) > maxUnlockWeeks) {
        onUserInput(String(maxUnlockWeeks))
      } else {
        onUserInput(v)
      }
    },
    [maxUnlockWeeks, onUserInput],
  )
  const handleWeekSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { week } = e.currentTarget.dataset
      if (week) {
        onInput(week)
      }
    },
    [onInput],
  )

  return (
    <>
      <BalanceInput
        width="100%"
        mb="8px"
        placeholder="0"
        inputProps={{
          style: { textAlign: 'left', marginTop: '1px', marginBottom: '1px' },
          disabled,
          max: MAX_VECOMET_LOCK_WEEKS,
          pattern: '^[0-9]*$',
        }}
        value={value}
        appendComponent={<LockImageElement />}
        onUserInput={onInput}
        unit={t('Weeks')}
      />
      {disabled ? null : (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {weekOptions.map(({ value: v, label }) => (
            <ButtonBlocked
              key={v}
              data-week={v}
              disabled={disabled || maxUnlockWeeks < v}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === v ? 'subtle' : 'light'}
            >
              {label}
            </ButtonBlocked>
          ))}

          {showMax ? (
            <ButtonBlocked
              data-week={maxUnlockWeeks}
              disabled={disabled || maxUnlockWeeks <= 0}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === maxUnlockWeeks ? 'subtle' : 'light'}
            >
              {t('Max')}
            </ButtonBlocked>
          ) : null}
        </FlexGap>
      )}
    </>
  )
}

interface LockWeeksFormProps {
  fieldOnly?: boolean
  expired?: boolean
  disabled?: boolean
  hideLockWeeksDataSetStyle?: boolean
  customCometCard?: null | JSX.Element
  onDismiss?: () => void
}

export const LockWeeksForm: React.FC<React.PropsWithChildren<LockWeeksFormProps>> = ({
  fieldOnly,
  expired,
  disabled,
  customCometCard,
  hideLockWeeksDataSetStyle,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(cometLockWeeksAtom)

  return (
    <AutoRow alignSelf="start">
      <FlexGap gap="4px" alignItems="center" mb="4px">
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('add')}
        </Text>
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('duration')}
        </Text>
      </FlexGap>

      <WeekInput value={value} onUserInput={onChange} disabled={disabled} />

      {customCometCard}

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockWeeksDataSet hideLockWeeksDataSetStyle={hideLockWeeksDataSetStyle} />}

          {expired ? (
            <FlexGap width="100%" mt="16px" gap="16px">
              <SubmitUnlockButton />
              <SubmitRenewButton />
            </FlexGap>
          ) : (
            <SubmitLockButton disabled={disabled} onDismiss={onDismiss} />
          )}
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ disabled, onDismiss }: { disabled?: boolean; onDismiss?: () => void }) => {
  const { t } = useTranslation()
  const cometLockWeeks = useAtomValue(cometLockWeeksAtom)
  const _disabled = useMemo(() => !cometLockWeeks || cometLockWeeks === '0' || disabled, [cometLockWeeks, disabled])
  const increaseLockWeeks = useWriteIncreaseLockWeeksCallback(onDismiss)

  return (
    <Button mt="16px" disabled={_disabled} width="100%" onClick={increaseLockWeeks}>
      {t('Extend Lock')}
    </Button>
  )
}

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()
  const { cometLockedAmount } = useVeCometLockStatus()

  if (!cometLockedAmount) {
    return null
  }

  return (
    <ButtonBlocked variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </ButtonBlocked>
  )
}

const SubmitRenewButton = () => {
  const { t } = useTranslation()
  const cometLockWeeks = useAtomValue(cometLockWeeksAtom)
  const disabled = useMemo(() => !cometLockWeeks || Number(cometLockWeeks) <= 0, [cometLockWeeks])

  const renew = useWriteIncreaseLockWeeksCallback()

  return (
    <ButtonBlocked disabled={disabled} onClick={renew}>
      {t('Renew Lock')}
    </ButtonBlocked>
  )
}

