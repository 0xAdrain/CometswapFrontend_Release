import { Heading, PageHeader } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import Crumbs from './Crumbs'

const Hero = () => {
  const { t } = useTranslation()

  return (
    <PageHeader>
      <Crumbs />
      <Heading as="h1" scale="xxl" color="secondary">
        {t('Leaderboard')}
      </Heading>
    </PageHeader>
  )
}

export default Hero

