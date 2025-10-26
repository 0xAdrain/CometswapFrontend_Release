import BN from 'bignumber.js'
import { MAX_VECOMET_LOCK_WEEKS, WEEK } from 'config/constants/veComet'

export const getVeCometAmount = (cometToLocked: number | bigint | string, seconds: number | string): number => {
  return new BN(String(cometToLocked || 0))
    .times(seconds || 0)
    .div((MAX_VECOMET_LOCK_WEEKS + 1) * WEEK - 1)
    .toNumber()
}

