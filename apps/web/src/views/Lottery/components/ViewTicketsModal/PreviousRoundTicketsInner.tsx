import { Box, Text, Flex } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface PreviousRoundTicketsInnerProps {
  roundId?: string
  userTickets?: any[]
}

const PreviousRoundTicketsInner: React.FC<PreviousRoundTicketsInnerProps> = ({
  roundId,
  userTickets = [],
}) => {
  const { t } = useTranslation()

  return (
    <Box p="24px">
      <Text fontSize="16px" bold mb="16px">
        {t('Round')} #{roundId}
      </Text>
      <Flex flexDirection="column" gap="8px">
        {userTickets.length > 0 ? (
          userTickets.map((ticket, index) => (
            <Box key={index} p="8px" bg="backgroundAlt" borderRadius="8px">
              <Text>{t('Ticket')} #{ticket.id}</Text>
              <Text color="textSubtle">{ticket.numbers}</Text>
            </Box>
          ))
        ) : (
          <Text color="textSubtle">{t('No tickets found for this round')}</Text>
        )}
      </Flex>
    </Box>
  )
}

export default PreviousRoundTicketsInner