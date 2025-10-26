import { useState, useEffect } from 'react'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { useVeCometEnable } from 'hooks/useVeCometEnable'
import { ENABLE_EXTEND_LOCK_AMOUNT } from '../../../helpers'

interface ExtendEnableProps {
  hasEnoughComet: boolean
  handleConfirmClick: () => void
  pendingConfirmTx: boolean
  isValidAmount: boolean
  isValidDuration: boolean
}

const ExtendEnable: React.FC<React.PropsWithChildren<ExtendEnableProps>> = ({
  hasEnoughComet,
  handleConfirmClick,
  pendingConfirmTx,
  isValidAmount,
  isValidDuration,
}) => {
  const { handleEnable, pendingEnableTx } = useVeCometEnable(ENABLE_EXTEND_LOCK_AMOUNT)

  const [pendingEnableTxWithBalance, setPendingEnableTxWithBalance] = useState(pendingEnableTx)

  useEffect(() => {
    if (pendingEnableTx) {
      setPendingEnableTxWithBalance(true)
    } else if (hasEnoughComet) {
      setPendingEnableTxWithBalance(false)
    }
  }, [hasEnoughComet, pendingEnableTx])

  return (
    <ApproveConfirmButtons
      isApproveDisabled={!(isValidAmount && isValidDuration) || hasEnoughComet}
      isApproving={pendingEnableTxWithBalance}
      isConfirmDisabled={!(isValidAmount && isValidDuration) || !hasEnoughComet}
      isConfirming={pendingConfirmTx}
      onApprove={handleEnable}
      onConfirm={handleConfirmClick}
      useMinWidth={false}
    />
  )
}

export default ExtendEnable

