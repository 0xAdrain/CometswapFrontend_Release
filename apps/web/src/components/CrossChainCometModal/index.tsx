import { Modal, ModalProps } from '@cometswap/uikit'
import { ReactNode } from 'react'

interface CrossChainCometModalProps extends ModalProps {
  children?: ReactNode
}

export const CrossChainCometModal: React.FC<CrossChainCometModalProps> = ({ children, ...props }) => {
  return (
    <Modal title="Cross Chain Comet" {...props}>
      {children || <div>Cross Chain Comet Modal - Feature not implemented</div>}
    </Modal>
  )
}


