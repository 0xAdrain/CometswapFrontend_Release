import { Box, Text, Card, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { styled } from 'styled-components'

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 24px;
`

const HowToPlay = () => {
  const { t } = useTranslation()

  const steps = [
    {
      title: t('Buy Tickets'),
      description: t('Purchase lottery tickets with COMET tokens'),
    },
    {
      title: t('Wait for Draw'),
      description: t('Wait for the lottery draw to take place'),
    },
    {
      title: t('Check Results'),
      description: t('Check if your numbers match the winning combination'),
    },
  ]

  return (
    <StyledCard>
      <Text fontSize="20px" bold mb="16px">
        {t('How to Play')}
      </Text>
      <Flex flexDirection="column" gap="16px">
        {steps.map((step, index) => (
          <Box key={index}>
            <Text bold color="primary">
              {index + 1}. {step.title}
            </Text>
            <Text color="textSubtle">{step.description}</Text>
          </Box>
        ))}
      </Flex>
    </StyledCard>
  )
}

export default HowToPlay