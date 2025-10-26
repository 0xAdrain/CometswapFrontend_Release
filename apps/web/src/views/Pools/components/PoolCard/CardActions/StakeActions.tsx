import { Token } from '@cometswap/sdk'
import { Pool } from '@cometswap/widgets-internal'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)

