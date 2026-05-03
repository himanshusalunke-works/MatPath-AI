import { useTranslation } from 'react-i18next'
import TimelineItem from '../components/timeline/TimelineItem'
import { BellIcon, BellSlashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { relativeDay } from '../utils/formatters'

const FALLBACK_MILESTONES = [
  { label: 'Voter Registration Opens', date: '2026-04-01', passed: true, icon: '📋' },
  { label: 'Model Code of Conduct', date: '2026-04-20', passed: true, icon: '⚖️' },
  { label: 'Last day for voter list corrections', date: '2026-05-10', passed: false, icon: '✏️' },
  { label: 'Campaign End', date: '2026-05-20', passed: false, icon: '📢' },
  { label: 'Voting Day', date: '2026-05-22', passed: false, icon: '🗳️' },
  { label: 'Result Declaration', date: '2026-05-25', passed: false, icon: '📊' },
]

export default function TimelinePage() {
  const { t } = useTranslation()
  const [notificationsOn, setNotificationsOn] = useState(true)

  const { data: apiMilestones } = useQuery({
    queryKey: ['timeline'],
    queryFn: async () => {
      const res = await api.get('/timeline')
      return res.data
    },
    retry: false,
  })

  const rawMilestones = apiMilestones?.length ? apiMilestones : FALLBACK_MILESTONES

  const milestones = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Get user voter status from localStorage
    const user = JSON.parse(localStorage.getItem('matpath_user') || '{}')
    const isRegistered = user.profile?.voterStatus === 'yes'

    return rawMilestones.map(m => {
      const target = new Date(m.date)
      target.setHours(0, 0, 0, 0)
      
      let passed = target < today
      
      // If it's the registration milestone, it's only "passed" if user is registered
      if (m.label.toLowerCase().includes('registration')) {
        passed = isRegistered
      }

      return { ...m, passed }
    })
  }, [rawMilestones])

  // Compute stats
  const stats = useMemo(() => {
    const done = milestones.filter((m) => m.passed).length
    const total = milestones.length
    const votingDay = milestones.find((m) => m.label.toLowerCase().includes('voting'))
    const daysToVote = votingDay ? relativeDay(votingDay.date) : null
    return { done, total, daysToVote }
  }, [milestones])

  return (
    <div className="tl-page">
      {/* ── Hero header with premium design ── */}
      <section className="ed-hero ed-hero--timeline">
        <div className="ed-hero__content">
          <div className="ed-hero__info-wrap">
            <div className="ed-hero__badge">
              <CalendarDaysIcon className="w-5 h-5" />
              <span>{t('election_roadmap', 'Election Roadmap')}</span>
            </div>
            <h1 className="ed-hero__title">
              {t('timeline_title')}
            </h1>
            <p className="ed-hero__subtitle">
              Track every critical milestone on your path to voting day.
            </p>
          </div>

          {/* Stats row integrated into hero */}
          <div className="ed-hero__stats-card glass-light">
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value">{stats.done}</span>
              <span className="ed-hero__stat-label">Completed</span>
            </div>
            <div className="ed-hero__stat-divider" aria-hidden="true" />
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value">{stats.total - stats.done}</span>
              <span className="ed-hero__stat-label">Remaining</span>
            </div>
            <div className="ed-hero__stat-divider" aria-hidden="true" />
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value" style={{ color: 'var(--primary)' }}>{stats.daysToVote || '—'}</span>
              <span className="ed-hero__stat-label">Days To Vote</span>
            </div>
          </div>
        </div>
      </section>

      <div className="tl-main-grid">
        <div className="tl-main-content">
          {/* ── Timeline list ── */}
          <section className="tl-list" role="list" aria-label="Election milestones">
            {milestones.map((m, i) => (
              <TimelineItem
                key={m.date}
                milestone={m}
                index={i}
                isLast={i === milestones.length - 1}
              />
            ))}
          </section>
        </div>

        <aside className="tl-sidebar">
          {/* ── Notification card ── */}
          <div className="tl-notify glass">
            <div className="tl-notify__header">
              <div className={`tl-notify__icon-wrap ${notificationsOn ? 'tl-notify__icon-wrap--on' : ''}`}>
                {notificationsOn ? (
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <BellSlashIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </div>
              <button
                id="toggle-notifications"
                onClick={() => setNotificationsOn(!notificationsOn)}
                aria-label={notificationsOn ? 'Turn off notifications' : 'Turn on notifications'}
                className={`tl-toggle ${notificationsOn ? 'tl-toggle--on' : ''}`}
              >
                <span className="tl-toggle__knob" />
              </button>
            </div>
            
            <div className="tl-notify__body">
              <p className="tl-notify__title">
                {notificationsOn ? 'Deadline Reminders' : 'Reminders Off'}
              </p>
              <p className="tl-notify__desc">
                {notificationsOn
                  ? "Stay ahead of the curve. We'll send you high-priority alerts for every upcoming election deadline."
                  : 'Turn on notifications to ensure you never miss an important registration or voting deadline.'}
              </p>
            </div>
          </div>
          
          <div className="tl-help-card glass">
             <h4 className="font-bold text-[var(--on-surface)] mb-2">Need Help?</h4>
             <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
               If you notice any discrepancies in the dates, please contact your local Booth Level Officer (BLO) or call the Voter Helpline at 1950.
             </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
