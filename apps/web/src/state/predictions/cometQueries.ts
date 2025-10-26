import { BetResponse, RoundResponse, UserResponse } from './responseType'

export interface UserResponseCOMET extends UserResponse<BetResponseCOMET> {
  totalCOMET: string
  totalCOMETBull: string
  totalCOMETBear: string
  averageCOMET: string
  totalCOMETClaimed: string
  netCOMET: string
}

export interface BetResponseCOMET extends BetResponse {
  claimedCOMET: string
  claimedNetCOMET: string
  user?: UserResponseCOMET
  round?: RoundResponseCOMET
}

export type RoundResponseCOMET = RoundResponse<BetResponseCOMET>

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */

export const betBaseFields = `
  id
  hash
  amount
  position
  claimed
  claimedAt
  claimedHash
  claimedBlock
  claimedCOMET
  claimedNetCOMET
  createdAt
  updatedAt
`

export const userBaseFields = `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalCOMET
  totalCOMETBull
  totalCOMETBear
  totalBetsClaimed
  totalCOMETClaimed
  winRate
  averageCOMET
  netCOMET
`

