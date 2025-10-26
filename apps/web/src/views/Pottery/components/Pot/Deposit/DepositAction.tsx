import { Box, Button, Flex, HelpIcon, InputProps, LogoRoundIcon, Skeleton, Text, useTooltip } from '@cometswap/uikit'
import { NumericalInput } from '@cometswap/widgets-internal'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'

import { useTranslation } from '@cometswap/localization'
import { COMET} from '@cometswap/tokens'
import { getBalanceNumber, getFullDisplayBalance } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTokenBalance from 'hooks/useTokenBalance'
import { useLatestVaultAddress, usePotteryData } from 'state/pottery/hook'
import { PotteryDepositStatus } from 'state/types'
import { useUserEnoughCometValidator } from 'views/Pools/components/LockedPool/hooks/useUserEnoughCometValidator'
import DepositButton from './DepositButton'
import EnableButton from './EnableButton'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`

const Container = styled.div<InputProps>`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, isWarning }) => (isWarning ? theme.shadows.warning : theme.shadows.inset)};
`

interface DepositActionProps {
  totalValueLockedValue: number
}

const DepositAction: React.FC<React.PropsWithChildren<DepositActionProps>> = ({ totalValueLockedValue }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { publicData, userData } = usePotteryData()
  const lastVaultAddress = useLatestVaultAddress()
  const [depositAmount, setDepositAmount] = useState('')

  const maxTotalDepositToNumber = getBalanceNumber(publicData.maxTotalDeposit)
  const remainingCometCanStake = new BigNumber(maxTotalDepositToNumber).minus(totalValueLockedValue).toString()

  const { balance: userComet } = useTokenBalance(chainId ? COMET[chainId]?.address : undefined)
  const userCometDisplayBalance = getFullDisplayBalance(userComet, 18, 3)
  const { userNotEnoughComet, notEnoughErrorMessage } = useUserEnoughCometValidator(depositAmount, userComet)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'COMETdeposit will be diverted to the fixed-term staking pool. Please note that COMETdeposited can ONLY be withdrawn after 10 weeks.',
    ),
    {
      placement: 'bottom',
    },
  )

  const onClickMax = () => {
    const userCometBalance = userComet.dividedBy(DEFAULT_TOKEN_DECIMAL).toString()

    if (new BigNumber(userCometBalance).gte(remainingCometCanStake)) {
      setDepositAmount(remainingCometCanStake)
    } else {
      setDepositAmount(userCometBalance)
    }
  }

  const showMaxButton = useMemo(
    () => new BigNumber(depositAmount).multipliedBy(DEFAULT_TOKEN_DECIMAL).eq(userComet),
    [depositAmount, userComet],
  )

  const isLessThanOneComet = useMemo(() => new BigNumber(depositAmount).lt(1), [depositAmount])

  const isReachMaxAmount = useMemo(() => {
    return (
      new BigNumber(totalValueLockedValue).eq(maxTotalDepositToNumber) || new BigNumber(remainingCometCanStake).lt(1)
    )
  }, [maxTotalDepositToNumber, totalValueLockedValue, remainingCometCanStake])

  if (userData.isLoading) {
    return <Skeleton width="100%" height="48px" />
  }

  if (publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK) {
    return (
      <Button disabled mt="10px" width="100%">
        {t('Deposit closed until next Pottery')}
      </Button>
    )
  }

  if (userData.allowance.isLessThanOrEqualTo(0) && lastVaultAddress) {
    return <EnableButton potteryVaultAddress={lastVaultAddress} />
  }

  if (isReachMaxAmount) {
    return (
      <Button disabled mt="10px" width="100%">
        {t('Max. deposit cap reached')}
      </Button>
    )
  }

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
          {t('Deposit')}
        </Text>
        <Text fontSize="12px" ml="4px" color="textSubtle" bold as="span">
          COMET
        </Text>
      </Box>
      <InputPanel>
        <Container isWarning={isLessThanOneComet}>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Balance: %balance%', { balance: userCometDisplayBalance })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={depositAmount}
              onUserInput={(val) => setDepositAmount(val)}
            />
            <Flex ml="8px">
              {!showMaxButton && (
                <Button onClick={onClickMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                  {t('Max').toUpperCase()}
                </Button>
              )}
              <LogoRoundIcon m="0 4px" width="24px" height="24px" />
              <Text>COMET</Text>
            </Flex>
          </Flex>
        </Container>
        {isLessThanOneComet && (
          <Text color="failure" fontSize="14px" textAlign="right">
            {t('Please deposit at least 1 COMETto participate in the Pottery')}
          </Text>
        )}
      </InputPanel>
      <Flex>
        <Flex ml="auto">
          <Text fontSize="12px" color="textSubtle">
            {t('Deposited COMETwill be locked for 10 weeks')}
          </Text>
          <Flex ref={targetRef}>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>{' '}
        </Flex>
      </Flex>
      {userNotEnoughComet ? (
        <Button disabled mt="10px" width="100%">
          {notEnoughErrorMessage}
        </Button>
      ) : lastVaultAddress ? (
        <DepositButton
          status={publicData.getStatus}
          depositAmount={depositAmount}
          potteryVaultAddress={lastVaultAddress}
          setDepositAmount={setDepositAmount}
        />
      ) : null}
    </Box>
  )
}

export default DepositAction

