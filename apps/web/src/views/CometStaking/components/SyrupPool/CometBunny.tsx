import { Flex, Image } from '@cometswap/uikit'
import { styled } from 'styled-components'

const StyledCometBunny = styled(Flex)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

interface CometBunnyProps {
  width?: string
  height?: string
}

export const CometBunny: React.FC<CometBunnyProps> = ({ width = '64px', height = '64px' }) => {
  return (
    <StyledCometBunny>
      <Image
        src="/images/comet-bunny.png"
        alt="Comet Bunny"
        width={width}
        height={height}
      />
    </StyledCometBunny>
  )
}