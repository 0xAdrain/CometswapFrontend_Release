import { Button, ButtonProps } from '@cometswap/uikit'
import { styled } from 'styled-components'

const StyledCometButton = styled(Button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

export const CometButton: React.FC<ButtonProps> = (props) => {
  return <StyledCometButton {...props} />
}