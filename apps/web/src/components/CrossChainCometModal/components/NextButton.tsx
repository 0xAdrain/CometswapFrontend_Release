import { Button, ButtonProps } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'

interface NextButtonProps extends ButtonProps {
  onNext?: () => void
}

export const NextButton: React.FC<NextButtonProps> = ({ onNext, ...props }) => {
  const { t } = useTranslation()

  return (
    <Button onClick={onNext} {...props}>
      {props.children || t('Next')}
    </Button>
  )
}


