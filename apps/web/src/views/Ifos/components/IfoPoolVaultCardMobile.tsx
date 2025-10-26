import {
  Balance,
  Box,
  Card,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  TokenPairImage as UITokenPairImage,
} from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

import { useTranslation } from '@cometswap/localization'
import { Token } from '@cometswap/sdk'
import { getBalanceNumber } from '@cometswap/utils/formatBalance'
import { vaultPoolConfig } from 'config/constants/pools'
import { useIfoCredit, useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { CometVaultDetail } from 'views/Pools/components/CometVaultCard'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

interface IfoPoolVaultCardMobileProps {
  pool?: Pool.DeserializedPool<Token>
}

const IfoPoolVaultCardMobile: React.FC<React.PropsWithChildren<IfoPoolVaultCardMobileProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const credit = useIfoCredit()
  const { isExpanded, setIsExpanded } = useConfig()
  const cometAsNumberBalance = getBalanceNumber(credit)

  const vaultPool = useVaultPoolByKey(pool?.vaultKey || VaultKey.CometVault)

  const { userData, fees } = vaultPool
  const { userShares, isLoading: isVaultUserDataLoading } = userData ?? {}
  const { performanceFeeAsDecimal } = fees ?? {}

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool?.userData || isVaultUserDataLoading

  if (!pool) {
    return null
  }

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.CometVault].tokenImage} />
            <Box ml="8px" width="180px">
              <Text small bold>
                {vaultPoolConfig[VaultKey.CometVault].name}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {vaultPoolConfig[VaultKey.CometVault].description}
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('iCOMET')}
            </Text>
            <Balance small bold decimals={3} value={cometAsNumberBalance} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <CometVaultDetail
          showIComet
          isLoading={isLoading}
          account={account}
          pool={pool}
          vaultPool={vaultPool}
          accountHasSharesStaked={accountHasSharesStaked}
          performanceFeeAsDecimal={performanceFeeAsDecimal}
        />
      )}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile

