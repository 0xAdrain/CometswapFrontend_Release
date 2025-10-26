import { ReactNode } from 'react'
import { Box, ICometIcon, LogoRoundIcon } from '@cometswap/uikit'
import { ChainLogo } from '@cometswap/widgets-internal'
import { ChainId } from '@cometswap/sdk'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'

type Props = {
  iconTop: ReactNode
  iconBottom: ReactNode
} & SpaceProps

const DoubleContainer = styled(Box)`
  position: relative;
  align-self: flex-start;
`

const IconBottomContainer = styled(Box)`
  position: relative;
  z-index: 1;
`

const IconTopContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
`

export function DoubleIcon({ iconTop, iconBottom, ...props }: Props) {
  return (
    <DoubleContainer {...props}>
      <IconBottomContainer>{iconBottom}</IconBottomContainer>
      <IconTopContainer>{iconTop}</IconTopContainer>
    </DoubleContainer>
  )
}

type IfoIconProps = {
  chainId?: ChainId
} & SpaceProps

export function IfoIcon({ chainId, ...props }: IfoIconProps) {
  return (
    <DoubleIcon
      iconBottom={<ICometIcon width="24px" height="24px" />}
      iconTop={<ChainLogo chainId={chainId} width={16} height={16} />}
      {...props}
    />
  )
}

export function ICometLogo(props: SpaceProps) {
  return (
    <DoubleIcon
      iconBottom={<LogoRoundIcon width="32px" height="32px" />}
      iconTop={<ICometIcon width="24px" height="24px" />}
      {...props}
    />
  )
}

