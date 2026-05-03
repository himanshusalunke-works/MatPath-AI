// Utility functions

/**
 * Format a date string to locale-friendly display
 * @param {string} dateStr - ISO date string e.g. "2025-05-22"
 * @param {string} locale  - BCP-47 locale e.g. "hi-IN"
 */
export function formatDate(dateStr, locale = 'en-IN') {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Return relative label: "Today", "X days away", "X days ago"
 */
export function relativeDay(dateStr) {
  if (!dateStr) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target - today) / 86400000)
  if (diff === 0) return 'Today'
  if (diff > 0) return `In ${diff} day${diff > 1 ? 's' : ''}`
  return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''} ago`
}

/**
 * Return raw days left as an integer
 */
export function getDaysLeft(dateStr = '2026-05-22') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target - today) / 86400000)
  return diff > 0 ? diff : 0
}

/**
 * Truncate text to maxLen characters
 */
export function truncate(text, maxLen = 80) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

/**
 * Generate a UUID v4
 */
export function generateSessionId() {
  return crypto.randomUUID()
}
