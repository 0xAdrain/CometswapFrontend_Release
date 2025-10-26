import { useTranslation } from '@cometswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@cometswap/uikit'
import { LockCometForm } from '../LockCometForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const Migrate = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Migrate to get veCOMET')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCometForm disabled />
        <LockWeeksForm disabled />
      </Grid>
    </StyledCard>
  )
}

