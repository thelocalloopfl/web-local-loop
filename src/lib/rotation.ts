/**
 * Checks if a listing is active given optional start/end date
 */
export const isActiveByDate = (
  start?: string,
  end?: string,
  now = new Date()
): boolean => {
  const s = start ? new Date(start) : undefined
  const e = end ? new Date(end) : undefined
  if (s && now < s) return false
  if (e && now > e) return false
  return true
}

/**
 * Deterministic daily shuffle of an array — same order per day
 */
export const dailyShuffle = <T,>(arr: T[]): T[] => {
  const seed = new Date().toISOString().slice(0, 10)
  let h = 0
  for (let i = 0; i < seed.length; i++)
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(48271, h) | 0
    const j = Math.abs(h) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
