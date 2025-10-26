import { SUPPORTED_CHAIN_IDS } from '@cometswap/ifos'

import { IfoPageLayout } from '../../views/Ifos'
import Ifo from '../../views/Ifos/Ifo'

const CurrentIfoPage = () => {
  return <Ifo />
}

CurrentIfoPage.Layout = IfoPageLayout

CurrentIfoPage.chains = SUPPORTED_CHAIN_IDS

export default CurrentIfoPage

