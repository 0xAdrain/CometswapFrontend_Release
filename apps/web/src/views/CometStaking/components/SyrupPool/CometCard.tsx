import { Card, CardProps } from '@cometswap/uikit'
import { styled } from 'styled-components'

const StyledCometCard = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  }
  
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0;
  }
`

export const CometCard: React.FC<CardProps> = (props) => {
  return <StyledCometCard {...props} />
}