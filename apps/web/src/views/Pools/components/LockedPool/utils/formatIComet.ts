import BigNumber from 'bignumber.js'
import { formatNumber } from '@cometswap/utils/formatBalance'

const formatIComet = (value: BigNumber | string | number): string => {
  const valueBN = new BigNumber(value)
  
  if (valueBN.isZero()) {
    return '0'
  }
  
  if (valueBN.lt(0.001)) {
    return '<0.001'
  }
  
  return formatNumber(valueBN.toNumber(), 0, 3)
}

export default formatIComet




