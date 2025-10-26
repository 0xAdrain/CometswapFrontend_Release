import { SUPPORT_COMET_STAKING } from 'config/constants/supportChains'
import veCometStaking from 'views/veCometStaking'

const veCometStakingPage = () => <veCometStaking />

veCometStakingPage.chains = SUPPORT_COMET_STAKING

export default veCometStakingPage

