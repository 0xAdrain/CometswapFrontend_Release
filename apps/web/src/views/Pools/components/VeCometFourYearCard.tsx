import { useTranslation } from '@cometswap/localization'
import { Button, Card, CardBody, CardFooter, Flex, Image, Text } from '@cometswap/uikit'
import NextLink from 'next/link'
import { styled } from 'styled-components'
import { useFourYearTotalCometApr } from 'views/CometStaking/hooks/useAPR'

const CardWrapper = styled(Flex)`
  position: relative;
  width: 100%;
  margin-top: 30px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 110px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`

const ImageWrapper = styled(Image)`
  display: none;
  position: absolute;
  width: 174px;
  height: 196px;
  z-index: 2;
  left: -45%;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
  padding: 8px 24px 16px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: calc(100% - 48px);
    top: 0px;
    left: 24px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

export const VeCometFourYearCard = () => {
  const { t } = useTranslation()
  const { totalApr } = useFourYearTotalCometApr()

  return (
    <CardWrapper>
      <ImageWrapper
        width={174}
        height={196}
        placeholder="blur"
        alt="boosterCardImage"
        src="/images/pool/pool-Comet-card-icon.png"
      />
      <Card p="0px" style={{ zIndex: 1 }}>
        <StyledCardBody style={{ padding: '8px 24px 2px 24px' }}>
          <Text fontSize={14} bold color="secondary">
            {t('COMET Staking')}
          </Text>
          <Text fontSize={20} bold color="text">
            {t('Up to %apr%% APR', { apr: totalApr.toFixed(2) })}
          </Text>
        </StyledCardBody>
        <StyledCardFooter>
          <Text color="textSubtle" fontSize={12}>
            {t('Stake COMETto get veCOMET, earn up to %apr%% APR from veCOMETpool and revenue sharing.', {
              apr: totalApr.toFixed(2),
            })}
          </Text>
          <Text color="textSubtle" fontSize={12} mt="8px">
            {t('Unlock other benefits like voting incentives, yield boosting, IFO, and so much more...')}
          </Text>
          <NextLink href="/comet-staking" passHref>
            <Button mt="16px" width="100%" variant="subtle">
              {t('Go to veCOMETstaking')}
            </Button>
          </NextLink>
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

