import { useTranslation } from '@cometswap/localization'
import {
  AddIcon,
  Balance,
  Flex,
  IconButton,
  Message,
  MessageText,
  MinusIcon,
  Skeleton,
  Text,
  useModal,
} from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'
// Migration-related imports removed

import { Token } from '@cometswap/sdk'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { useCometPrice } from 'hooks/useCometPrice'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cometPool'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'

interface HasStakeActionProps {
  pool: Pool.DeserializedPool<Token>
  stakingTokenBalance: BigNumber
  performanceFee?: number
}

const HasSharesActions: React.FC<React.PropsWithChildren<HasStakeActionProps>> = ({
  pool,
  stakingTokenBalance,
  performanceFee,
}) => {
  const { userData } = useVaultPoolByKey(pool.vaultKey ?? VaultKey.CometVault)

  const cometAsBigNumber = userData?.balance?.cometAsBigNumber
  const cometAsNumberBalance = userData?.balance?.cometAsNumberBalance
  // Migration check removed - no longer needed

  const lockPosition = getVaultPosition(userData)

  const { stakingToken } = pool
  const { t } = useTranslation()
  const cometPrice = useCometPrice()
  const stakedDollarValue = cometPrice.gt(0)
    ? getBalanceNumber(cometAsBigNumber?.multipliedBy(cometPrice), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={cometAsBigNumber ?? new BigNumber(0)} pool={pool} isRemovingStake />,
    true,
    true,
    `withdraw-vault-${pool.sousId}-${pool.vaultKey}`,
  )
  return (
    <LightGreyCard>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={cometAsNumberBalance ?? 0} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {cometPrice.gt(0) ? (
              <Balance
                value={stakedDollarValue}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
        <Flex>
          <IconButton
            variant="secondary"
            onClick={() => {
              onPresentUnstake()
            }}
            mr="6px"
          >
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton
            disabled
            variant="secondary"
            onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
          >
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
      <Message variant="warning" mb="16px">
        <MessageText>
          {lockPosition === VaultPosition.Flexible ? (
            t('Flexible COMETpool is discontinued and no longer distributing rewards.')
          ) : (
            t(
              'The lock period has ended. To get more veCOMET, withdraw from the unlocked COMETpool position, and add COMETto veCOMET.',
            )
          )}
        </MessageText>
      </Message>
    </LightGreyCard>
  )
}

export default HasSharesActions

