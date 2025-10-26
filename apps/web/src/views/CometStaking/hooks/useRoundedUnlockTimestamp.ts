import { useMemo } from 'react'

// Round unlock timestamp to the nearest week (Thursday 00:00 UTC)
export function useRoundedUnlockTimestamp(timestamp?: number): number | undefined {
  return useMemo(() => {
    if (!timestamp) return undefined

    const date = new Date(timestamp * 1000)
    
    // Get the day of the week (0 = Sunday, 4 = Thursday)
    const dayOfWeek = date.getUTCDay()
    
    // Calculate days until next Thursday
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7
    
    // If it's already Thursday, go to next Thursday
    const targetDate = new Date(date)
    targetDate.setUTCDate(date.getUTCDate() + (daysUntilThursday || 7))
    targetDate.setUTCHours(0, 0, 0, 0)
    
    return Math.floor(targetDate.getTime() / 1000)
  }, [timestamp])
}