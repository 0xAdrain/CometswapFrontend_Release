import { Grid, useMatchBreakpoints } from '@cometswap/uikit'
import { useLockModal } from 'views/CometStaking/hooks/useLockModal'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { CometLockStatus } from '../../types'
import { ApproveAndLockModal } from '../ApproveAndLockModal'
import { CometPoolLockStatus } from '../CometPoolLockStatus'
import { LockedCometStatus } from '../LockedCometStatus'
import { Expired } from './Expired'
import { Migrate } from './Migrate'
import { NotLocking } from './NotLocking'
import { Staking } from './Staking'

const customCols = {
  [CometLockStatus.NotLocked]: '1fr',
  [CometLockStatus.Expired]: 'auto 1fr',
}

export const LockComet = () => {
  const { status } = useVeCometLockStatus()
  const { isMobile } = useMatchBreakpoints()

  const { modal, modalData } = useLockModal()

  return (
    <>
      <ApproveAndLockModal {...modal} {...modalData} />
      <Grid
        mt="22px"
        gridGap="24px"
        gridTemplateColumns={isMobile ? '1fr' : customCols[status] ?? '1fr 2fr'}
        justifyItems={status === CometLockStatus.Expired ? 'end' : 'start'}
        mx="auto"
      >
        {status === CometLockStatus.Migrate ? <CometPoolLockStatus /> : <LockedCometStatus status={status} />}
        {status === CometLockStatus.NotLocked ? <NotLocking /> : null}
        {status === CometLockStatus.Locking ? <Staking /> : null}
        {status === CometLockStatus.Expired ? <Expired /> : null}
        {status === CometLockStatus.Migrate ? <Migrate /> : null}
      </Grid>
    </>
  )
}

