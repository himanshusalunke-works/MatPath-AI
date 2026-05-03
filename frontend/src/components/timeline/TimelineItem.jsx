import { useTranslation } from 'react-i18next'
import { formatDate, relativeDay } from '../../utils/formatters'
import {
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

export default function TimelineItem({ milestone, isLast, index = 0 }) {
  const { i18n } = useTranslation()
  const { label, date, passed, icon } = milestone
  const relative = relativeDay(date)
  const isToday = relative === 'Today'

  // Format the day number and month separately for the date badge
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('en-IN', { month: 'short' })

  return (
    <div
      className={`tl-item ${passed ? 'tl-item--done' : isToday ? 'tl-item--active' : 'tl-item--upcoming'}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      role="listitem"
      aria-label={`${label} — ${formatDate(date, i18n.language + '-IN')}`}
    >
      {/* Connector line */}
      {!isLast && (
        <div className={`tl-connector ${passed ? 'tl-connector--done' : ''}`} aria-hidden="true">
          <div className="tl-connector__line" />
        </div>
      )}

      {/* Node dot */}
      <div className="tl-node" aria-hidden="true">
        <div className={`tl-node__dot ${passed ? 'tl-node__dot--done' : isToday ? 'tl-node__dot--active' : ''}`}>
          {passed ? (
            <CheckCircleSolid className="tl-node__icon tl-node__icon--done" />
          ) : isToday ? (
            <ClockIcon className="tl-node__icon tl-node__icon--active" />
          ) : (
            <ClockIcon className="tl-node__icon tl-node__icon--upcoming" />
          )}
        </div>
        {isToday && <div className="tl-node__pulse" />}
      </div>

      {/* Card */}
      <div className={`tl-card ${passed ? 'tl-card--done' : isToday ? 'tl-card--active' : 'tl-card--upcoming'}`}>
        {/* Date badge */}
        <div className={`tl-date-badge ${passed ? 'tl-date-badge--done' : isToday ? 'tl-date-badge--active' : ''}`}>
          <span className="tl-date-badge__day">{day}</span>
          <span className="tl-date-badge__month">{month}</span>
        </div>

        {/* Content */}
        <div className="tl-card__body">
          <div className="tl-card__top">
            <h3 className="tl-card__title">{icon || ''} {label}</h3>
            <span className={`tl-badge ${passed ? 'tl-badge--done' : isToday ? 'tl-badge--active' : 'tl-badge--upcoming'}`}>
              {passed ? '✓ Done' : isToday ? '● Today' : relative}
            </span>
          </div>
          <p className="tl-card__date">{formatDate(date, i18n.language + '-IN')}</p>
        </div>

        {/* Active glow accent */}
        {isToday && <div className="tl-card__glow" aria-hidden="true" />}
      </div>
    </div>
  )
}
