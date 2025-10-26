import { ChainId } from '@cometswap/chains'
import { useTranslation } from '@cometswap/localization'
import { COMET} from '@cometswap/tokens'
import { Button } from '@cometswap/uikit'
import { formatBigInt } from '@cometswap/utils/formatBalance'
import { Ifo } from '@cometswap/widgets-internal'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useMemo } from 'react'
import { SpaceProps } from 'styled-system'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCometPrice } from 'hooks/useCometPrice'

// TODO should be common hooks
// import { useIsMigratedToComet } from 'views/CometStaking/hooks/useIsMigratedToComet'
// import { useIsUserDelegated } from 'views/CometStaking/hooks/useIsUserDelegated'
// import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'

import { useUserIfoInfo } from '../hooks/useUserIfoInfo'

function NavigateButton(props: SpaceProps) {
  const { t } = useTranslation()

  return (
    <Button width="100%" as={Link} href="/comet-staking" {...props}>
      {t('Go to COMET Staking')}
    </Button>
  )
}

type Props = {
  ifoAddress?: Address
}

export function CometCard({ ifoAddress }: Props) {
  const { chainId } = useActiveChainId()
  const { isConnected } = useAccount()
  const cometPrice = useCometPrice()
  // Simplified staking values - migration logic removed
  const isUserDelegated = false
  const nativeUnlockTime = 0
  const nativecometLockedAmount = 0n
  const proxyCometLockedAmount = 0n
  const proxyLocked = false
  const proxyUnlockTime = 0
  const nativeLocked = false
  // Migration logic removed - no longer needed
  const totalLockComet = useMemo(
    () =>
      Number(
        formatBigInt(
          isUserDelegated ? nativecometLockedAmount : nativecometLockedAmount + proxyCometLockedAmount,
          COMET[chainId || ChainId.BSC].decimals,
        ),
      ),
    [nativecometLockedAmount, proxyCometLockedAmount, chainId, isUserDelegated],
  )
  const hasProxyCometButNoNativecomet = useMemo(() => !nativeLocked && proxyLocked, [nativeLocked, proxyLocked])
  const unlockAt = useMemo(() => {
    if (hasProxyCometButNoNativecomet) {
      return proxyUnlockTime
    }
    return nativeUnlockTime
  }, [hasProxyCometButNoNativecomet, nativeUnlockTime, proxyUnlockTime])

  const { snapshotTime, credit, Comet, ratio } = useUserIfoInfo({ ifoAddress, chainId })
  const creditBN = useMemo(
    () => credit && new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()),
    [credit],
  )
  const hasIComet = useMemo(() => creditBN && creditBN.toNumber() > 0, [creditBN])
  const hasComet = useMemo(() => Comet && Comet.toNumber() > 0, [Comet])

  const header = (
    <>
      <Ifo.MyIComet amount={creditBN} />
      <Ifo.IfoSalesLogo hasIComet={hasIComet} />
    </>
  )

  return (
    <Ifo.CometCard header={header}>
      <Ifo.MyComet amount={Comet} />
      <Ifo.ICometInfo mt="1.5rem" snapshot={snapshotTime} ratio={ratio} />

      {isConnected && hasIComet && totalLockComet ? (
        <Ifo.LockInfoCard mt="1.5rem" amount={totalLockComet} unlockAt={unlockAt} usdPrice={cometPrice} />
      ) : null}

      {isConnected && !hasComet ? (
        hasProxyCometButNoNativecomet && !isUserDelegated ? (
          <Ifo.InsufficientNativecometTips mt="1.5rem" />
        ) : (
          <Ifo.ZeroCometTips mt="1.5rem" />
        )
      ) : null}

      {/* Migration tips removed - no longer needed */}
      {isConnected ? <NavigateButton mt="1.5rem" /> : <ConnectWalletButton width="100%" mt="1.5rem" />}
    </Ifo.CometCard>
  )
}

