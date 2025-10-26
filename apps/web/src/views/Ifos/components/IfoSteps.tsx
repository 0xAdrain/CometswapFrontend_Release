import { Box, Text, Step, Stepper } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

const IfoSteps = () => {
  const { t } = useTranslation()

  const steps = [
    { title: t('Get COMET'), description: t('You need COMET to participate') },
    { title: t('Enable COMET'), description: t('Enable your COMET for the IFO') },
    { title: t('Commit COMET'), description: t('Commit your COMET to the IFO') },
  ]

  return (
    <Box>
      <Text fontSize="20px" bold mb="16px">
        {t('How to Participate')}
      </Text>
      <Stepper>
        {steps.map((step, index) => (
          <Step key={index} index={index} statusFirstPart="current">
            <Text bold>{step.title}</Text>
            <Text color="textSubtle">{step.description}</Text>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default IfoSteps