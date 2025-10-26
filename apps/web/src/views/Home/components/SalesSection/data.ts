import { TranslateFunction } from '@cometswap/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration, no hassle.'),
  bodyText: t('Trade any token on BNB Smart Chain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cometswap.finance/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'COMET', alt: t('COMETtoken') },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('CometSwap makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/liquidity/pools',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cometswap.finance/products/yield-farming',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with comet token') },
    ],
  },
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('COMETmakes our world go round.'),
  bodyText: t(
    'COMETtoken is at the heart of the CometSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy COMET'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cometswap.finance/tokenomics/comet',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/comet/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d comet') },
      { src: 'top-right', alt: t('Small 3d comet') },
      { src: 'coin', alt: t('COMETtoken') },
      { src: 'top-left', alt: t('Small 3d comet') },
    ],
  },
})

