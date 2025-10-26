import { Flex, LogoIcon, Tag, TagProps, Text } from '@cometswap/uikit'

interface CometSwapXTagProps extends TagProps {
  logoWidth?: string
  fontSize?: string
}

export const CometSwapXTag = ({ logoWidth, fontSize, ...props }: CometSwapXTagProps) => {
  return (
    <Tag variant="success" style={{ width: 'fit-content' }} {...props}>
      <Flex>
        <LogoIcon width={logoWidth} />
        <Text ml="6px" color="white" fontSize={fontSize} bold>
          CometSwap X
        </Text>
      </Flex>
    </Tag>
  )
}

