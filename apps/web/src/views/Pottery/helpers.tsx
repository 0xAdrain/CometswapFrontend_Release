import BigNumber from 'bignumber.js'
import { PotteryDepositStatus } from 'state/types'

interface CalculateCometAmount {
  status: PotteryDepositStatus
  previewRedeem: string
  shares: string
  totalSupply: BigNumber
  totalLockComet: BigNumber
}

export const calculateCometAmount = ({
  status,
  previewRedeem,
  shares,
  totalSupply,
  totalLockComet,
}: CalculateCometAmount): BigNumber => {
  if (status === PotteryDepositStatus.LOCK) {
    return new BigNumber(shares).div(totalSupply).times(totalLockComet)
  }

  return new BigNumber(previewRedeem)
}

