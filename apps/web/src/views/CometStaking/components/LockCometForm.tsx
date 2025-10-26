import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { COMET} from '@cometswap/tokens'
import { AutoRow, Balance, BalanceInput, BalanceInputProps, Button, Flex, FlexGap, Text } from '@cometswap/uikit'
import { formatBigInt, getDecimalAmount, getFullDisplayBalance } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import { TokenImage } from 'components/TokenImage'
import { useCometPrice } from 'hooks/useCometPrice'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { cometLockAmountAtom } from 'state/Comet/atoms'
import { useBSCCometBalance } from '../hooks/useBSCCometBalance'
import { useWriteApproveAndIncreaseLockAmountCallback } from '../hooks/useContractWrite'
import { LockCometDataSet } from './DataSet/LockCometDataSet'

const percentShortcuts = [25, 50, 75]

const CometInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const cometPrice = useCometPrice()
  const cakeUsdValue = useMemo(() => {
    return cometPrice && value ? cometPrice.times(value).toNumber() : 0
  }, [cometPrice, value])
  const [percent, setPercent] = useState<number | null>(null)
  const _cakeBalance = useBSCCometBalance()
  const cakeBalance = BigInt(_cakeBalance.toString())

  const onInput = useCallback(
    (input: string) => {
      setPercent(null)
      onUserInput(input === '.' ? '0.' : input)
    },
    [onUserInput],
  )

  const handlePercentChange = useCallback(
    (p: number) => {
      if (p > 0) {
        onUserInput(getFullDisplayBalance(new BN(cakeBalance.toString()).multipliedBy(p).dividedBy(100), 18, 18))
      } else {
        onUserInput('')
      }
      setPercent(p)
    },
    [cakeBalance, onUserInput, setPercent],
  )

  const balance = (
    <Flex>
      <Text textAlign="left" color="textSubtle" ml="4px" fontSize="12px">
        {t('Balance: %balance%', { balance: formatBigInt(cakeBalance, 2) })}
      </Text>
    </Flex>
  )

  const usdValue = (
    <Flex>
      <Balance mt={1} fontSize="12px" color="textSubtle" decimals={2} value={cakeUsdValue} unit=" USD" prefix="~" />
    </Flex>
  )

  const appendComponent = (
    <Flex alignSelf="center" width={40} mr={12}>
      <TokenImage width={40} height={40} token={COMET[ChainId.BSC]} />
    </Flex>
  )

  return (
    <>
      <BalanceInput
        width="100%"
        mb="8px"
        value={value}
        onUserInput={onInput}
        inputProps={{ style: { textAlign: 'left', height: '20px' }, disabled }}
        currencyValue={usdValue}
        unit={balance}
        appendComponent={appendComponent}
      />
      {!disabled && balance ? (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {percentShortcuts.map((p) => {
            return (
              <Button
                key={p}
                style={{ flex: 1 }}
                scale="sm"
                variant={p === percent ? 'primary' : 'tertiary'}
                onClick={() => handlePercentChange(p)}
              >
                {`${p}%`}
              </Button>
            )
          })}
          <Button
            scale="sm"
            style={{ flex: 1 }}
            variant={percent === 100 ? 'primary' : 'tertiary'}
            onClick={() => handlePercentChange(100)}
          >
            {t('Max')}
          </Button>
        </FlexGap>
      ) : null}
    </>
  )
}

export const LockCometForm: React.FC<{
  // show input field only
  fieldOnly?: boolean
  disabled?: boolean
  hideLockCometDataSetStyle?: boolean
  customCometCard?: null | JSX.Element
  onDismiss?: () => void
}> = ({ fieldOnly, disabled, customCometCard, hideLockCometDataSetStyle, onDismiss }) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(cometLockAmountAtom)

  return (
    <AutoRow alignSelf="start">
      <FlexGap gap="4px" alignItems="center" mb="4px">
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('add')}
        </Text>
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('COMET')}
        </Text>
      </FlexGap>
      <CometInput value={value} onUserInput={onChange} disabled={disabled} />

      {customCometCard}

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockCometDataSet hideLockCometDataSetStyle={hideLockCometDataSetStyle} />}

          <SubmitLockButton onDismiss={onDismiss} />
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ onDismiss }: { onDismiss?: () => void }) => {
  const { t } = useTranslation()
  const _cakeBalance = useBSCCometBalance()
  const cometLockAmount = useAtomValue(cometLockAmountAtom)
  const disabled = useMemo(
    () =>
      !cometLockAmount || cometLockAmount === '0' || getDecimalAmount(new BN(cometLockAmount)).gt(_cakeBalance.toString()),
    [_cakeBalance, cometLockAmount],
  )
  const increaseLockAmount = useWriteApproveAndIncreaseLockAmountCallback(onDismiss)

  return (
    <Button mt="16px" disabled={disabled} width="100%" onClick={increaseLockAmount}>
      {t('Add COMET')}
    </Button>
  )
}

