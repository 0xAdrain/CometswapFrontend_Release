import { PredictionSupportedSymbol } from '@cometswap/prediction'
import { betBaseFields as betBaseFieldsBNB, userBaseFields as userBaseFieldsBNB } from './bnbQueries'
import { betBaseFields as betBaseFieldsCOMET, userBaseFields as userBaseFieldsCOMET} from './cometQueries'
import {
  betBaseFields as newBetBaseFields,
  roundBaseFields as newRoundBaseFields,
  userBaseFields as newUserBaserBaseFields,
} from './newTokenQueries'

export const getRoundBaseFields = newRoundBaseFields

export const getBetBaseFields = (tokenSymbol: string) => {
  // BSC COMET
  if (tokenSymbol === PredictionSupportedSymbol.COMET) {
    return betBaseFieldsCOMET
  }
  // BSC BNB
  if (tokenSymbol === PredictionSupportedSymbol.BNB) {
    return betBaseFieldsBNB
  }

  return newBetBaseFields
}

export const getUserBaseFields = (tokenSymbol: string) => {
  // BSC COMET
  if (tokenSymbol === PredictionSupportedSymbol.COMET) {
    return userBaseFieldsCOMET
  }
  // BSC BNB
  if (tokenSymbol === PredictionSupportedSymbol.BNB) {
    return userBaseFieldsBNB
  }

  return newUserBaserBaseFields
}

