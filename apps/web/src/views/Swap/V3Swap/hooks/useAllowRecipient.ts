import { useExpertMode } from '@cometswap/utils/user'

import { useIsWrapping } from './useIsWrapping'

export function useAllowRecipient() {
  const [isExpertMode] = useExpertMode()
  const isWrapping = useIsWrapping()
  return isExpertMode && !isWrapping
}

