import { useTranslation } from '@cometswap/localization'
import {
  Box,
  CheckmarkCircleIcon,
  FlexGap,
  FlexGapProps,
  HotIcon,
  LockIcon,
  PauseCircleIcon,
  SplitIcon,
  Tag,
  TagProps,
  Text,
  UnlockIcon,
  WarningIcon,
} from '@cometswap/uikit'
import Trans from 'components/Trans'
import { ReactNode, useMemo } from 'react'
import { DeserializedLockedVaultUser } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/cometPool'
// Migration and delegation hooks removed

const tagConfig: Record<VaultPosition, TagProps> = {
  [VaultPosition.None]: {},
  [VaultPosition.Flexible]: {
    variant: 'success',
  },
  [VaultPosition.Locked]: {
    variant: 'secondary',
  },
  [VaultPosition.LockedEnd]: {
    variant: 'secondary',
    outline: true,
  },
  [VaultPosition.AfterBurning]: {
    variant: 'failure',
    outline: true,
  },
}
const iconConfig: Record<VaultPosition, any> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: SplitIcon,
  [VaultPosition.Locked]: LockIcon,
  [VaultPosition.LockedEnd]: UnlockIcon,
  [VaultPosition.AfterBurning]: HotIcon,
}

const iconColorConfig: Record<VaultPosition, any> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: 'white',
  [VaultPosition.Locked]: 'white',
  [VaultPosition.LockedEnd]: 'secondary',
  [VaultPosition.AfterBurning]: 'failure',
}

const positionLabel: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: '',
  [VaultPosition.Flexible]: <Trans>Flexible</Trans>,
  [VaultPosition.Locked]: <Trans>Locked</Trans>,
  [VaultPosition.LockedEnd]: <Trans>Locked End</Trans>,
  [VaultPosition.AfterBurning]: <Trans>After Burning</Trans>,
}

const VaultPositionTag: React.FC<React.PropsWithChildren<{ position: VaultPosition }>> = ({ position }) => {
  return (
    <Tag {...tagConfig[position]}>
      <Box as={iconConfig[position]} mr="4px" color={iconColorConfig[position]} />
      {positionLabel[position]}
    </Tag>
  )
}

const CometVaultPositionTag: React.FC = () => {
  const { t } = useTranslation()
  // Migration status removed - always show as active
  return (
    <Tag variant="success">
      <Box as={CheckmarkCircleIcon} mr="4px" color="white" />
      {t('Active')}
    </Tag>
  )
}

const CometDelegatedTag: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Tag variant="warning">
      <Box as={WarningIcon} mr="4px" color="white" />
      {t('Converted')}
    </Tag>
  )
}

export const VaultPositionTagWithLabel: React.FC<
  React.PropsWithChildren<{ userData?: DeserializedLockedVaultUser } & FlexGapProps>
> = ({ userData, ...props }) => {
  const { t } = useTranslation()
  // Delegation check removed

  const position = useMemo(() => getVaultPosition(userData), [userData])

  if (position) {
    return (
      <FlexGap alignItems="center" justifyContent="space-between" marginX="8px" mb="8px" gap="12px" {...props}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('My Position')}
        </Text>
        {position < VaultPosition.LockedEnd ? (
          <CometVaultPositionTag />
        ) : (
          <VaultPositionTag position={position} />
        )}
      </FlexGap>
    )
  }

  return null
}

