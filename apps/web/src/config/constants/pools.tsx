import { bscTokens } from '@cometswap/tokens'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'

export const vaultPoolConfig = {
  // Legacy vault V1 removed
  [VaultKey.veCometVault]: {
    name: <Trans>Stake COMET</Trans>,
    description: <Trans>This product has been upgraded</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1100000n,
    tokenImage: {
      primarySrc: `/images/cakeGrey.png`,
      secondarySrc: '/images/autorenew-disabled.png',
    },
  },
  // Flexible side vault removed
  [VaultKey.IfoPool]: {
    name: 'IFO COMET',
    description: <Trans>Stake COMETto participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000n,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.comet.address}.png`,
      secondarySrc: `/images/ifo-pool-icon.svg`,
    },
  },
} as const

