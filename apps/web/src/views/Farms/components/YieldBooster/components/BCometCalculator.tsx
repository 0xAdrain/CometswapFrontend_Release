import { useTranslation } from '@cometswap/localization'
import {
  BalanceInput,
  Box,
  Button,
  CalculatorMode,
  EditingCurrency,
  Flex,
  HelpIcon,
  Text,
  Toggle,
  useRoiCalculatorReducer,
  useTooltip,
} from '@cometswap/uikit'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import _toNumber from 'lodash/toNumber'
import { useEffect, useMemo, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { useBveCometTooltipContent } from 'views/Farms/components/YieldBooster/components/bveCometV3/BveCometBoosterCard'
import { useUserLockedveCometStatus } from 'views/Farms/hooks/useUserLockedveCometStatus'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { useAccount } from 'wagmi'
import { useGetCalculatorMultiplier } from '../hooks/useGetBoostedAPR'
import LockDurationField from './BveCometLockedDuration'

const BveCometBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 16px;
`
interface BveCometCalculatorProps {
  targetInputBalance: string
  earningTokenPrice: number
  lpTokenStakedAmount: BigNumber
  initialState?: any
  stakingTokenSymbol?: string
  setBveCometMultiplier: (multiplier: number) => void
}

const BveCometCalculator: React.FC<React.PropsWithChildren<BveCometCalculatorProps>> = ({
  targetInputBalance,
  earningTokenPrice,
  initialState,
  stakingTokenSymbol = 'COMET',
  lpTokenStakedAmount,
  setBveCometMultiplier,
}) => {
  const [isShow, setIsShow] = useState(true)
  const { t } = useTranslation()
  const [duration, setDuration] = useState(() => weeksToSeconds(1))
  const { isLoading, lockedAmount, lockedStart, lockedEnd } = useUserLockedveCometStatus()
  const { state, setPrincipalFromUSDValue, setPrincipalFromTokenValue, toggleEditingCurrency, setCalculatorMode } =
    useRoiCalculatorReducer(
      { stakingTokenPrice: earningTokenPrice, earningTokenPrice, autoCompoundFrequency: 0 },
      initialState,
    )
  const { editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data
  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }
  const userBalanceInFarm = useMemo(
    () => new BigNumber(targetInputBalance).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [targetInputBalance],
  )
  const userLockedAmount = useMemo(
    () => new BigNumber(principalAsToken).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [principalAsToken],
  )

  const bveCometMultiplier = useGetCalculatorMultiplier(userBalanceInFarm, lpTokenStakedAmount, userLockedAmount, duration)

  useEffect(() => {
    setBveCometMultiplier(bveCometMultiplier)
  }, [bveCometMultiplier, setBveCometMultiplier])

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const { address: account } = useAccount()

  const tooltipContent = useBveCometTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
  })

  const {
    targetRef: myBalanceTargetRef,
    tooltip: myBalanceTooltip,
    tooltipVisible: myBalanceTooltipVisible,
  } = useTooltip(t('Boost multiplier calculation does not include profit from COMETstaking pool'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })
  const theme = useTheme()

  return (
    <>
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase" mt="24px" mb="8px">
        {t('Yield Booster')}
      </Text>

      <Toggle scale="md" checked={isShow} onClick={() => setIsShow(!isShow)} />
      {isShow && (
        <>
          <BveCometBlock style={{ marginTop: 24 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('veComet locked')}
            </Text>
            <BalanceInput
              inputProps={{
                scale: 'sm',
              }}
              currencyValue={`${conversionValue} ${conversionUnit}`}
              // innerRef={balanceInputRef}
              placeholder="0.00"
              value={editingValue}
              unit={editingUnit}
              onUserInput={onUserInput}
              switchEditingUnits={toggleEditingCurrency}
              onFocus={onBalanceFocus}
            />
            <Flex justifyContent="space-between" mt="8px">
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('100')}
              >
                $100
              </Button>
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('1000')}
              >
                $1000
              </Button>
              <Button
                disabled={!account || isLoading || lockedAmount?.eq(0)}
                scale="xs"
                p="4px 16px"
                width="128px"
                variant="tertiary"
                style={{ textTransform: 'uppercase' }}
                onClick={() =>
                  setPrincipalFromUSDValue(getBalanceNumber(lockedAmount?.times(earningTokenPrice)).toFixed(2))
                }
              >
                {t('My Balance')}
              </Button>
              <span ref={myBalanceTargetRef}>
                <HelpIcon width="16px" height="16px" color="textSubtle" />
              </span>
              {myBalanceTooltipVisible && myBalanceTooltip}
            </Flex>
            <LockDurationField
              duration={duration}
              setDuration={setDuration}
              currentDuration={_toNumber(lockedEnd) - _toNumber(lockedStart)}
              isOverMax={false}
            />
          </BveCometBlock>
          <BveCometBlock style={{ marginTop: 16 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              <>{t('Boost Multiplier')}</>
            </Text>
            <Text color="text" bold fontSize="20px" textTransform="uppercase">
              <>{bveCometMultiplier}X</>
              {tooltipVisible && tooltip}
              <Box ref={targetRef} marginLeft="3px" display="inline-block" position="relative" top="3px">
                <HelpIcon color={theme.colors.textSubtle} />
              </Box>
            </Text>
            <Text color="textSubtle" fontSize={12}>
              {t(
                'The estimated boost multiplier is calculated using live data. The actual boost multiplier may change upon activation.',
              )}
            </Text>
          </BveCometBlock>
        </>
      )}
    </>
  )
}

export default BveCometCalculator

export const getBveCometMultiplier = (
  userBalanceInFarm: BigNumber,
  userLockAmount: BigNumber,
  userLockDuration: number,
  totalLockAmount: BigNumber,
  lpBalanceOfFarm: BigNumber,
  averageLockDuration: number,
  cA: number,
  cB: number,
) => {
  const dB = userBalanceInFarm.times(cA)
  const aBPart1 = lpBalanceOfFarm.times(userLockAmount).times(userLockDuration)
  const aBPart3 = totalLockAmount.times(averageLockDuration)
  const aB = aBPart1.dividedBy(cB).dividedBy(aBPart3)
  const bigNumberResult = dB.plus(aB).gt(userBalanceInFarm)
    ? userBalanceInFarm.dividedBy(dB)
    : dB.plus(aB).dividedBy(dB)
  return bigNumberResult
}

