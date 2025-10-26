import { useTranslation } from '@cometswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading, useMatchBreakpoints } from '@cometswap/uikit'
import { getDecimalAmount } from '@cometswap/utils/formatBalance'
import BN from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useMemo } from 'react'
import { useLockCometData } from 'state/Comet/hooks'
import { useWriteApproveAndLockCallback } from 'views/CometStaking/hooks/useContractWrite'
import { useAccount } from 'wagmi'
import { useBSCCometBalance } from '../../hooks/useBSCCometBalance'
import { NewStakingDataSet } from '../DataSet'
import { LockCometForm } from '../LockCometForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  return (
    <>
      <Box maxWidth={['100%', '100%', '72%']} mx="auto">
        <NotLockingCard />
      </Box>
    </>
  )
}

interface NotLockingCardProps {
  hideTitle?: boolean
  hideCardPadding?: boolean
  customCometCard?: JSX.Element
  customDataRow?: JSX.Element
  onDismiss?: () => void
}

export const NotLockingCard: React.FC<React.PropsWithChildren<NotLockingCardProps>> = ({
  hideTitle,
  hideCardPadding,
  customCometCard,
  customDataRow,
  onDismiss,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const _cakeBalance = useBSCCometBalance()
  const { cometLockAmount, cometLockWeeks } = useLockCometData()
  const { isDesktop } = useMatchBreakpoints()

  const disabled = useMemo(
    () =>
      Boolean(
        !Number(cometLockAmount) ||
          !Number(cometLockWeeks) ||
          getDecimalAmount(new BN(cometLockAmount)).gt(_cakeBalance.toString()),
      ),
    [_cakeBalance, cometLockAmount, cometLockWeeks],
  )

  const handleModalOpen = useWriteApproveAndLockCallback(onDismiss)

  return (
    <StyledCard innerCardProps={{ padding: hideCardPadding ? 0 : ['24px 16px', '24px 16px', '24px'] }}>
      {!hideTitle && <Heading scale="md">{t('Lock COMETto get veCOMET')}</Heading>}
      <Grid
        gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'}
        gridColumnGap="24px"
        gridRowGap={isDesktop ? '0' : '24px'}
        padding={[0, 0, 12]}
        mt={32}
        mb={32}
      >
        <LockCometForm fieldOnly />
        <LockWeeksForm fieldOnly />
      </Grid>
      <NewStakingDataSet
        cakeAmount={Number(cometLockAmount)}
        customCometCard={customCometCard}
        customDataRow={customDataRow}
      />
      <ColumnCenter>
        {account ? (
          <Button disabled={disabled} width={['100%', '100%', '50%']} onClick={handleModalOpen}>
            {t('Lock COMET')}
          </Button>
        ) : (
          <ConnectWalletButton width={['100%', '100%', '50%']} />
        )}
      </ColumnCenter>
    </StyledCard>
  )
}

