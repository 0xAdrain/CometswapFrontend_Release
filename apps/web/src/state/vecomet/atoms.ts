import { atom } from 'jotai'

export enum ApproveAndLockStatus {
  // no modal
  IDLE,
  // approve token, send tx
  APPROVING_TOKEN,
  // send lock tx
  LOCK_COMET,
  // lock pending, wait for lock confirmation
  LOCK_COMET_PENDING,
  // lock confirmed
  INCREASE_AMOUNT,
  INCREASE_AMOUNT_PENDING,
  INCREASE_WEEKS,
  INCREASE_WEEKS_PENDING,
  UNLOCK_COMET,
  UNLOCK_COMET_PENDING,
  // Migration states removed
  CONFIRMED,
  ERROR,
  // any user rejection
  REJECT,
}

export const approveAndLockStatusAtom = atom<ApproveAndLockStatus>(ApproveAndLockStatus.IDLE)
export const cometLockAmountAtom = atom<string>('0')
export const cometLockWeeksAtom = atom<string>('26')
export const cometLockTxHashAtom = atom<`0x${string}` | ''>('')
export const cometLockApprovedAtom = atom<boolean>(false)

