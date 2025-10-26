export enum ApproveAndLockStatus {
  IDLE = 'idle',
  APPROVING = 'approving',
  APPROVED = 'approved',
  LOCKING = 'locking',
  LOCKED = 'locked',
  ERROR = 'error',
}

export interface CometLockState {
  status: ApproveAndLockStatus
  amount?: string
  lockEndTime?: number
  txHash?: string
  error?: string
}

export const initialCometLockState: CometLockState = {
  status: ApproveAndLockStatus.IDLE,
}

// Atom-like state management (simplified)
let cometLockState = initialCometLockState

export const getCometLockState = () => cometLockState

export const setCometLockState = (newState: Partial<CometLockState>) => {
  cometLockState = { ...cometLockState, ...newState }
}

export const resetCometLockState = () => {
  cometLockState = initialCometLockState
}




