import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import SwapLayout from 'views/Swap/SwapLayout'

import AnimatedLayout from 'components/AnimatedLayout'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AnimatedLayout direction="right">
      <Page showExternalLink={false} showHelpLink={false}>
        {children}
      </Page>
    </AnimatedLayout>
  )
}

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const TwapPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap />
  </SwapLayout>
)

TwapPage.chains = CHAIN_IDS
TwapPage.screen = true
TwapPage.Layout = Layout

export default TwapPage


