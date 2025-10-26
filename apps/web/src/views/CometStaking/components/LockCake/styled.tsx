import { Card } from '@cometswap/uikit'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
  align-self: start;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  margin: 0 auto;
`

