import { Column } from '@cometswap/uikit'
import { PropsWithChildren, memo } from 'react'

import { SwapUIV2 } from '@cometswap/widgets-internal'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <SwapUIV2.InputPanelWrapper id="swap-page">
      <Column gap="sm">{children}</Column>
    </SwapUIV2.InputPanelWrapper>
  )
})

