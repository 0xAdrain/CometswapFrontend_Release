import { ASSET_CDN } from 'config/constants/endpoints'
import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | CometSwap',
  defaultTitle: 'CometSwap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@CometSwap',
    site: '@CometSwap',
  },
  openGraph: {
    title: "🥞 CometSwap - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: `${ASSET_CDN}/web/og/v2/hero.jpg` }],
  },
}
