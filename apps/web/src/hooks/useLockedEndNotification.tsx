import { useToast, Text, StyledLink } from '@cometswap/uikit'
import { NextLinkFromReactRouter } from '@cometswap/widgets-internal'

import { useEffect } from 'react'
import { useTranslation } from '@cometswap/localization'
import isUndefinedOrNull from '@cometswap/utils/isUndefinedOrNull'
import { useAtom } from 'jotai'
import { useAccount } from 'wagmi'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useQueryClient } from '@tanstack/react-query'
import { useUserCometLockStatus } from './useUserCometLockStatus'

const lockedNotificationShowAtom = atomWithStorageWithErrorCatch('lockedNotificationShow', true, () => sessionStorage)
function useLockedNotificationShow() {
  return useAtom(lockedNotificationShowAtom)
}

const LockedEndDescription: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text>{t('The locked staking duration has ended.')}</Text>
      <NextLinkFromReactRouter to="/pools" prefetch={false}>
        <StyledLink color="primary">{t('Go to Pools')}</StyledLink>
      </NextLinkFromReactRouter>
    </>
  )
}

const useLockedEndNotification = () => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const queryClient = useQueryClient()
  const { address: account } = useAccount()
  const isUserLockedEnd = useUserCometLockStatus()
  const [lockedNotificationShow, setLockedNotificationShow] = useLockedNotificationShow()

  useEffect(() => {
    if (account) {
      if (!isUndefinedOrNull(isUserLockedEnd)) {
        setLockedNotificationShow(true)
        queryClient.invalidateQueries({
          queryKey: ['userveCometLockStatus', account],
        })
      }
    } else {
      setLockedNotificationShow(true)
    }
  }, [setLockedNotificationShow, account, queryClient, isUserLockedEnd])

  useEffect(() => {
    if (toastInfo && isUserLockedEnd && lockedNotificationShow) {
      toastInfo(t('veComet Syrup Pool'), <LockedEndDescription />)
      setLockedNotificationShow(false) // show once
    }
  }, [isUserLockedEnd, toastInfo, lockedNotificationShow, setLockedNotificationShow, t])
}

export default useLockedEndNotification

