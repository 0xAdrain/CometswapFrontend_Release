import { Button, MoreHorizontalIcon, useModal } from '@cometswap/uikit'
import { styled } from 'styled-components'
import MobileSettingsDrawer from './MobileSettingsDrawer'

const StyledButton = styled(Button)`
  min-width: 36px;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.default};
  display: flex;
  align-items: center;
  justify-content: center;
`

interface MobileMoreButtonProps {
  className?: string
  style?: React.CSSProperties
}

const MobileMoreButton = ({ className, style }: MobileMoreButtonProps) => {
  const [onPresentMobileSettingsDrawer] = useModal(<MobileSettingsDrawer />, true, true, 'mobileSettingsDrawer')

  return (
    <StyledButton 
      onClick={onPresentMobileSettingsDrawer} 
      variant="secondary" 
      scale="xs" 
      className={className}
      style={style}
    >
      <MoreHorizontalIcon color="invertedContrast" width="20px" height="20px" />
    </StyledButton>
  )
}

export default MobileMoreButton

