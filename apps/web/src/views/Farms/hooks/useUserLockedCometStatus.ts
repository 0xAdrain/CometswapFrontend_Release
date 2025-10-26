import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCometVault, VaultKey } from 'state/types'

export const useUserLockedCometStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.CometVault) as DeserializedLockedCometVault

  return {
    totalCometInVault: vaultPool?.totalCometInVault,
    totalLockedAmount: vaultPool?.totalLockedAmount,
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
    lockedAmount: vaultPool?.userData?.lockedAmount,
    lockBalance: vaultPool?.userData?.balance,
    lockedStart: vaultPool?.userData?.lockStartTime,
  }
}

