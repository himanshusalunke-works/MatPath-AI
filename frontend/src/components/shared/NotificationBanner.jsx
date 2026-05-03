import { useState, useEffect } from 'react'
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline'

export default function NotificationBanner({ message, type = 'info', dismissible = true, autoClose = 0 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose > 0) {
      const t = setTimeout(() => setVisible(false), autoClose)
      return () => clearTimeout(t)
    }
  }, [autoClose])

  if (!visible || !message) return null

  const colorMap = {
    info:    'bg-[#0057A8] text-white',
    success: 'bg-[#388E3C] text-white',
    warning: 'bg-amber-500 text-white',
    error:   'bg-[#D32F2F] text-white',
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-md
        animate-fade-in ${colorMap[type] || colorMap.info}
      `}
    >
      <BellIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss notification"
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
