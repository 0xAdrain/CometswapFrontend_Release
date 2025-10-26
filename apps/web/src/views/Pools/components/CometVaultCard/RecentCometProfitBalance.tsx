import { Token } from '@cometswap/sdk'
import { TooltipText, useTooltip, Balance } from '@cometswap/uikit'
import { Pool } from '@cometswap/widgets-internal'

import AutoEarningsBreakdown from '../AutoEarningsBreakdown'

interface RecentCometProfitBalanceProps {
  cakeToDisplay: number
  pool: Pool.DeserializedPool<Token>
  account: string
}

const RecentCometProfitBalance: React.FC<React.PropsWithChildren<RecentCometProfitBalanceProps>> = ({
  cakeToDisplay,
  pool,
  account,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom-end',
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={cakeToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentCometProfitBalance

