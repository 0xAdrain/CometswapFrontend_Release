import { useTranslation } from '@cometswap/localization'
import { Balance, Box, Flex, LogoRoundIcon, Text } from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'
import { useMemo } from 'react'

import { Token } from '@cometswap/sdk'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import { usePoolsWithVault, useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCometVault, VaultKey } from 'state/types'

const SharingPoolNameCell = () => {
  const { t } = useTranslation()
  const { userData } = useVaultPoolByKey(VaultKey.CometVault) as DeserializedLockedCometVault
  const { pools } = usePoolsWithVault()

  const cometPool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>
  const stakingToken = cometPool?.stakingToken
  const stakingTokenPrice = cometPool?.stakingTokenPrice

  const currentLockedAmountNumber = useMemo(
    () => userData?.balance?.cometAsNumberBalance,
    [userData?.balance?.cometAsNumberBalance],
  )

  const usdValueStaked = useMemo(
    () =>
      stakingToken && stakingTokenPrice
        ? getBalanceNumber(userData?.balance?.cometAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
        : null,
    [userData?.balance?.cometAsBigNumber, stakingTokenPrice, stakingToken],
  )

  return (
    <Flex mb="16px">
      <LogoRoundIcon mr="8px" width={43} height={43} style={{ minWidth: 43 }} />
      <Box>
        <Text fontSize={12} color="secondary" bold lineHeight="110%" textTransform="uppercase">
          {t('COMETlocked')}
        </Text>
        <Balance bold decimals={2} fontSize={20} lineHeight="110%" value={currentLockedAmountNumber ?? 0} />
        <Balance
          bold
          prefix="~ "
          unit=" USD"
          decimals={2}
          fontSize={12}
          fontWeight={400}
          lineHeight="110%"
          color="textSubtle"
          value={usdValueStaked ?? 0}
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell

