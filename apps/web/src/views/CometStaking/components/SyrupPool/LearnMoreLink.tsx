import { useTranslation } from '@cometswap/localization'
import { Link, StyledLink } from '@cometswap/uikit'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import NextLink from 'next/link'

export const LearnMoreLink: React.FC<{ withArrow?: boolean }> = ({ withArrow }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <Link
      style={{
        display: 'inline',
        color: withArrow ? theme.colors.yellow : 'white',
        textDecoration: 'underline',
        fontSize: 14,
        marginLeft: 3,
      }}
      href="https://docs.cometswap.finance/products/Comet/migrate-from-comet-pool"
      external
    >
      {t('Learn more')}
      {withArrow && '»'}
    </Link>
  )
}

export const CometStakingPageLink: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <NextLink href="/comet-staking">
      <StyledLink
        style={{
          display: 'inline',
          textDecoration: 'underline',
          fontSize: 14,
          marginLeft: 3,
          color: 'white',
        }}
      >
        {t('COMETstaking page')}
      </StyledLink>
    </NextLink>
  )
})

