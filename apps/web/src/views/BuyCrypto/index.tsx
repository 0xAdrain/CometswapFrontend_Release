// import React from 'react' // Removed unused import
import { motion } from 'framer-motion'
import AnimatedPageWrapper from 'components/AnimatedPageWrapper'
import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { useProviderAvailabilities } from './hooks/useProviderAvailabilities'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  useDefaultsFromURLSearch()
  const { data: providerAvailabilities } = useProviderAvailabilities()
  
  return (
    <AnimatedPageWrapper>
      <StyledAppBody mb="24px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <BuyCryptoForm providerAvailabilities={providerAvailabilities} />
        </motion.div>
      </StyledAppBody>
    </AnimatedPageWrapper>
  )
}

