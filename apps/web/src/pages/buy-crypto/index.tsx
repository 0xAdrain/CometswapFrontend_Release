import { useMemo } from 'react'
import { BuyCryptoAtomProvider, createFormAtom } from 'state/buyCrypto/reducer'
import { CHAIN_IDS } from 'utils/wagmi'
import AnimatedLayout from 'components/AnimatedLayout'
import BuyCrypto from 'views/BuyCrypto'
import Page from 'views/Page'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AnimatedLayout direction="right">
      <Page showExternalLink={false} showHelpLink={false}>
        {children}
      </Page>
    </AnimatedLayout>
  )
}

const BuyCryptoPage = () => {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <BuyCryptoAtomProvider
      value={{
        formAtom,
      }}
    >
      <BuyCrypto />
    </BuyCryptoAtomProvider>
  )
}

BuyCryptoPage.chains = CHAIN_IDS
BuyCryptoPage.Layout = Layout

export default BuyCryptoPage



