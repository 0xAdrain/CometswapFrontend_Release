import { Percent as CometPercent } from '@cometswap/sdk'

export function encodeFeeBips(fee: CometPercent): string {
  return fee.multiply(10_000).quotient.toString()
}
