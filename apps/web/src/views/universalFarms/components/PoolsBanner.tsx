import { useTheme } from '@cometswap/hooks'
import { useTranslation } from '@cometswap/localization'
import { Box, Button, Column, LinkExternal, PageHeader, Row, Text } from '@cometswap/uikit'
import { VerticalDivider } from '@cometswap/widgets-internal'
import { BCometBoosterCard } from 'views/Farms/components/YieldBooster/components/bCometV3/BCometBoosterCard'
import { FarmFlexWrapper, FarmH1, FarmH2 } from 'views/Farms/styled'

export const PoolsBanner = ({ additionLink }: { additionLink?: React.ReactNode }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageHeader>
      <Column>
        <FarmFlexWrapper>
          <Box style={{ flex: '1 1 100%' }}>
            <FarmH1 as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Earn from LP')}
            </FarmH1>
            <FarmH2 scale="lg" color="text">
              {t('Liquidity Pools & Farms')}
            </FarmH2>
            <Row flexWrap="wrap" gap="16px">
              <LinkExternal
                href="https://docs.cometswap.finance/products/yield-farming/how-to-use-farms"
                showExternalIcon={false}
              >
                <Button p="0" variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Learn How')}
                  </Text>
                </Button>
              </LinkExternal>
              {!!additionLink && (
                <>
                  <VerticalDivider bg={theme.colors.inputSecondary} />
                  {additionLink}
                </>
              )}
            </Row>
          </Box>
          <Box>
            <BCometBoosterCard />
          </Box>
        </FarmFlexWrapper>
      </Column>
    </PageHeader>
  )
}

