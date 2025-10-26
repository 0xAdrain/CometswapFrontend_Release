import { useTranslation } from '@cometswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@cometswap/uikit'
import { useVeCometLockStatus } from 'views/CometStaking/hooks/useVeCometUserInfo'
import { LockCometForm } from '../LockCometForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { NotLockingCard } from './NotLocking'
import { StyledCard } from './styled'

export const Staking = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { cometLocked } = useVeCometLockStatus()

  if (!cometLocked) return <NotLockingCard />

  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Increase your veCOMET')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCometForm />
        <LockWeeksForm />
      </Grid>
    </StyledCard>
  )
}

