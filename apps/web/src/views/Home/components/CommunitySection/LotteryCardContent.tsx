import { ArrowForwardIcon, Balance, Button, Flex, Skeleton, Text } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'
import { useEffect, useState } from 'react'

import { useIntersectionObserver } from '@cometswap/hooks'
import { useTranslation } from '@cometswap/localization'
import { getBalanceAmount } from '@cometswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCometPrice } from 'hooks/useCometPrice'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { styled } from 'styled-components'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const cometPrice = useCometPrice()
  const { data: currentLotteryId } = useQuery({
    queryKey: ['currentLotteryId'],
    queryFn: fetchCurrentLotteryId,
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { data: currentLottery } = useQuery({
    queryKey: ['currentLottery'],
    queryFn: async () => fetchLottery(currentLotteryId?.toString() ?? ''),
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const cakePrizesText = t('%cakePrizeInUsd% in COMETprizes this round', { cakePrizeInUsd: cometPrice.toString() })
  const [pretext, prizesThisRound] = cakePrizesText.split(cometPrice.toString())
  const amountCollectedInComet = currentLottery ? parseFloat(currentLottery.amountCollectedInComet) : null
  const currentLotteryPrize = amountCollectedInComet ? cometPrice.times(amountCollectedInComet) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="white" bold fontSize="16px">
          {t('Lottery')}
        </Text>
        {pretext && (
          <Text color="white" mt="12px" bold fontSize="16px">
            {pretext}
          </Text>
        )}
        {currentLotteryPrize && currentLotteryPrize.gt(0) ? (
          <StyledBalance
            fontSize="40px"
            bold
            prefix="$"
            decimals={0}
            value={getBalanceAmount(currentLotteryPrize).toNumber()}
          />
        ) : (
          <>
            <Skeleton width={200} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="white" mb="24px" bold fontSize="16px">
          {prizesThisRound}
        </Text>
        <Text color="white" mb="40px">
          {t('Buy tickets with COMET, win COMETif your numbers match')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/lottery" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Buy Tickets')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default LotteryCardContent

