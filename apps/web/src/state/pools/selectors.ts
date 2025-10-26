import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { VaultPosition, getVaultPosition } from '../../utils/cometPool'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId: number) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: pool ? transformPool(pool) : undefined, userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.veCometVault),
    makeVaultPoolByKey(VaultKey.veCometVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedveCometVault, deserializedFlexibleSideveCometVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const cometPool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutveCometPool = pools.filter((pool) => pool.sousId !== 0)

    const cometAutoVault = cometPool && {
      ...cometPool,
      ...deserializedLockedveCometVault,
      vaultKey: VaultKey.veCometVault,
      userData: { ...cometPool.userData, ...deserializedLockedveCometVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedveCometVault.userData)
    const hasFlexibleSideSharesStaked =
      deserializedFlexibleSideveCometVault?.userData && deserializedFlexibleSideveCometVault.userData.userShares.gt(0)

    const cometAutoFlexibleSideVault =
      cometPool && (lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked)
        ? [
            {
              ...cometPool,
              ...deserializedFlexibleSideveCometVault,
              vaultKey: VaultKey.veCometVault,
              userData: { ...cometPool.userData, ...deserializedFlexibleSideveCometVault.userData },
            },
          ]
        : []

    const allPools = [...cometAutoFlexibleSideVault, ...withoutveCometPool]
    if (cometAutoVault) {
      allPools.unshift(cometAutoVault)
    }
    return { pools: allPools, userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})

