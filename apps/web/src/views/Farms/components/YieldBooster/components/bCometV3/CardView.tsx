import { useTranslation } from '@cometswap/localization'
import { Box, Button, Flex } from '@cometswap/uikit'
import useTheme from 'hooks/useTheme'
import { useCallback, useMemo } from 'react'
import {
  useBCometBoostLimitAndLockInfo,
  useUserBoostedPoolsTokenId,
  useUserPositionInfo,
  useCometUserMultiplierBeforeBoosted,
} from '../../hooks/bCometV3/useBCometV3Info'
import { useBoostStatus } from '../../hooks/bCometV3/useBoostStatus'
import { useUpdateLiquidity } from '../../hooks/bCometV3/useUpdateLiquidity'

import { StatusView } from './StatusView'
import { StatusViewButtons } from './StatusViewButtons'

const SHOULD_UPDATE_THRESHOLD = 1.1

export const BCometV3CardView: React.FC<{
  tokenId: string
  pid: number
  isFarmStaking?: boolean
}> = ({ tokenId, pid, isFarmStaking }) => {
  const { t } = useTranslation()
  const { status: boostStatus, updateStatus } = useBoostStatus(pid, tokenId)
  const { updateBoostedPoolsTokenId } = useUserBoostedPoolsTokenId()
  const {
    data: { boostMultiplier },
    updateUserPositionInfo,
  } = useUserPositionInfo(tokenId)

  const onDone = useCallback(() => {
    updateStatus()
    updateUserPositionInfo()
    updateBoostedPoolsTokenId()
  }, [updateStatus, updateUserPositionInfo, updateBoostedPoolsTokenId])
  const { locked, isLockEnd } = useBCometBoostLimitAndLockInfo()

  const { updateLiquidity, isConfirming } = useUpdateLiquidity(tokenId, onDone)
  const { vecometUserMultiplierBeforeBoosted } = useCometUserMultiplierBeforeBoosted(tokenId)
  const { theme } = useTheme()
  const lockValidated = useMemo(() => {
    return locked && !isLockEnd
  }, [locked, isLockEnd])
  const shouldUpdate = useMemo(() => {
    if (
      boostMultiplier &&
      vecometUserMultiplierBeforeBoosted &&
      locked &&
      (boostMultiplier * SHOULD_UPDATE_THRESHOLD <= vecometUserMultiplierBeforeBoosted ||
        (boostMultiplier === 1 && vecometUserMultiplierBeforeBoosted > boostMultiplier))
    )
      return true
    return false
  }, [boostMultiplier, vecometUserMultiplierBeforeBoosted, locked])

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView
        status={boostStatus}
        boostedMultiplier={boostMultiplier}
        expectMultiplier={vecometUserMultiplierBeforeBoosted}
        isFarmStaking={isFarmStaking}
        shouldUpdate={shouldUpdate}
      />
      <Box>
        <StatusViewButtons
          locked={lockValidated}
          updateButton={
            shouldUpdate && lockValidated ? (
              <Button
                onClick={() => {
                  updateLiquidity()
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${theme.colors.primary}`,
                  color: theme.colors.primary,
                  padding: isConfirming ? '0 10px' : undefined,
                }}
                isLoading={isConfirming}
              >
                {isConfirming ? t('Confirming') : t('Update')}
              </Button>
            ) : null
          }
        />
      </Box>
    </Flex>
  )
}

