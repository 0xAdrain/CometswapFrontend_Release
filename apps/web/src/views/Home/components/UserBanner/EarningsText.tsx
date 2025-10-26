import { ContextApi } from '@cometswap/localization'
import BigNumber from 'bignumber.js'

export const getEarningsText = (
  numFarmsToCollect: number,
  hasCometPoolToCollect: boolean,
  earningsBusd: BigNumber,
  t: ContextApi['t'],
): string => {
  const data = {
    earningsBusd: earningsBusd.toString(),
    count: numFarmsToCollect,
  }

  let earningsText = t('%earningsBusd% to collect', data)

  if (numFarmsToCollect > 0 && hasCometPoolToCollect) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms and COMETpool', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm and COMETpool', data)
    }
  } else if (numFarmsToCollect > 0) {
    if (numFarmsToCollect > 1) {
      earningsText = t('%earningsBusd% to collect from %count% farms', data)
    } else {
      earningsText = t('%earningsBusd% to collect from %count% farm', data)
    }
  } else if (hasCometPoolToCollect) {
    earningsText = t('%earningsBusd% to collect from COMETpool', data)
  }

  return earningsText
}

