import { Flex, Text } from '@cometswap/uikit'
import { BIG_ZERO } from '@cometswap/utils/bigNumber'
import { Pool } from '@cometswap/widgets-internal'

import { useTranslation } from '@cometswap/localization'
import { Token } from '@cometswap/sdk'
import { useCometPrice } from 'hooks/useCometPrice'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedVaultUser, VaultKey } from 'state/types'
import { getCometVaultEarnings } from 'views/Pools/helpers'
import { useAccount } from 'wagmi'
import RecentCometProfitBalance from './RecentCometProfitBalance'

const RecentCometProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const cometPrice = useCometPrice()
  const { hasAutoEarnings, autoCometToDisplay } = getCometVaultEarnings(
    account,
    userData?.cometAtLastUserAction || BIG_ZERO,
    userData?.userShares || BIG_ZERO,
    pricePerFullShare || BIG_ZERO,
    cometPrice.toNumber(),
    pool.vaultKey === VaultKey.CometVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : undefined,
  )

  if (!(userData?.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent COMETprofit')}:`}</Text>
      {hasAutoEarnings && <RecentCometProfitBalance cometToDisplay={autoCometToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentCometProfitCountdownRow

