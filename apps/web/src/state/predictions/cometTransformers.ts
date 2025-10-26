import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseCOMET= (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedBNB: betResponse.claimedCOMET? parseFloat(betResponse.claimedCOMET) : 0,
    claimedNetBNB: betResponse.claimedNetCOMET? parseFloat(betResponse.claimedNetCOMET) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseCOMET(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseCOMET)
  }

  return bet
}

export const transformUserResponseCOMET= (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalCOMET, totalCOMETBull, totalCOMETBear, totalCOMETClaimed, averageCOMET, netCOMET} = userResponse || {}

  return {
    ...baseUserResponse,
    totalBNB: totalCOMET? parseFloat(totalCOMET) : 0,
    totalBNBBull: totalCOMETBull ? parseFloat(totalCOMETBull) : 0,
    totalBNBBear: totalCOMETBear ? parseFloat(totalCOMETBear) : 0,
    totalBNBClaimed: totalCOMETClaimed ? parseFloat(totalCOMETClaimed) : 0,
    averageBNB: averageCOMET? parseFloat(averageCOMET) : 0,
    netBNB: netCOMET? parseFloat(netCOMET) : 0,
  }
}

