import { useTranslation } from 'react-i18next'
import {
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

const STATUS_CONFIG = {
  completed: {
    Icon: CheckCircleSolid,
    iconClass: 'text-[#388E3C]',
    cardClass: 'step-completed bg-white',
    badge: 'completed',
    badgeClass: 'bg-[#388E3C]/10 text-[#388E3C]',
  },
  current: {
    Icon: PlayCircleIcon,
    iconClass: 'text-[#FF6B35]',
    cardClass: 'step-current bg-white shadow-md ring-1 ring-[#FF6B35]/20',
    badge: 'current',
    badgeClass: 'bg-[#FF6B35]/10 text-[#FF6B35]',
  },
  pending: {
    Icon: ClockIcon,
    iconClass: 'text-[#6C757D]',
    cardClass: 'step-pending bg-[#F3F4F6]',
    badge: 'pending',
    badgeClass: 'bg-[#E5E7EB] text-[#6C757D]',
  },
}

export default function JourneyStep({ step, title, description, status, link, onMarkComplete, isLast }) {
  const { t } = useTranslation()
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const { Icon, iconClass, cardClass, badge, badgeClass } = config

  return (
    <div className="flex gap-4">
      {/* Connector line */}
      <div className="flex flex-col items-center">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-[#388E3C]/10' :
          status === 'current'   ? 'bg-[#FF6B35]/10' : 'bg-[#E5E7EB]'
        }`}>
          <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${
            status === 'completed' ? 'bg-[#388E3C]/40' : 'bg-[#E5E7EB]'
          }`} aria-hidden="true" />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-2 rounded-xl p-4 transition-all duration-300 ${cardClass}`}
        role="article"
        aria-label={`Step ${step}: ${title} — ${status}`}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-semibold text-sm ${status === 'pending' ? 'text-[#6C757D]' : 'text-[#1C1C1E]'}`}>
            {title}
          </h3>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
            {t(badge)}
          </span>
        </div>

        {description && (
          <p className="text-xs text-[#6C757D] mb-3 leading-relaxed">{description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {link && status !== 'pending' && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              id={`step-link-${step}`}
              aria-label={`Open resource for step ${step}`}
              className="inline-flex items-center gap-1 text-xs text-[#0057A8] font-medium hover:underline"
            >
              Open resource
              <ArrowTopRightOnSquareIcon className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {status === 'current' && onMarkComplete && (
            <button
              id={`mark-complete-step-${step}`}
              onClick={() => onMarkComplete(step)}
              aria-label={`Mark step ${step} as complete`}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                bg-[#FF6B35] text-white hover:bg-[#e5541f]
                transition-all duration-200 active:scale-95
              "
            >
              <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {t('mark_complete')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
