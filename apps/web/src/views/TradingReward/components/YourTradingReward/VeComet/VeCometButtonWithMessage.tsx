import { Button, Flex, Message, Text } from '@cometswap/uikit'

interface VeCometButtonWithMessageProps {
  messageText: string
  buttonText: string
  onClick: () => void
}

export const VeCometButtonWithMessage: React.FC<React.PropsWithChildren<VeCometButtonWithMessageProps>> = ({
  messageText,
  buttonText,
  onClick,
}) => {
  return (
    <Message variant="warning">
      <Flex flexDirection="column" width="100%">
        <Text lineHeight="120%" mb="11px">
          {messageText}
        </Text>
        <Button ml="-36px" onClick={onClick}>
          {buttonText}
        </Button>
      </Flex>
    </Message>
  )
}
