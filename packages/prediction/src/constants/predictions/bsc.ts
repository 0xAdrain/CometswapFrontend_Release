import { ChainId } from '@cometswap/chains'
import { Native } from '@cometswap/sdk'
import { bscTokens } from '@cometswap/tokens'
import { chainlinkOracleBNB, chainlinkOracleCOMET} from '../../chainlinkOracleContract'
import { GRAPH_API_PREDICTION_BNB, GRAPH_API_PREDICTION_COMET} from '../../endpoints'
import { predictionsBNB, predictionsCOMET} from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    address: predictionsBNB[ChainId.BSC],
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleBNB[ChainId.BSC],
    displayedDecimals: 4,
    token: Native.onChain(ChainId.BSC),
    tokenBackgroundColor: '#F0B90B',
  },
  [PredictionSupportedSymbol.COMET]: {
    isNativeToken: false,
    address: predictionsCOMET[ChainId.BSC],
    api: GRAPH_API_PREDICTION_COMET[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleCOMET[ChainId.BSC],
    displayedDecimals: 4,
    token: bscTokens.comet,
    tokenBackgroundColor: '#25C7D6',
  },
}
