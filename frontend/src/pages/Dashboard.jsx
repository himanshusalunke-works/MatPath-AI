import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
  BookOpenIcon,
  FireIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import { getDaysLeft } from '../utils/formatters'

const getJourneySteps = (t) => [
  {
    id: 1,
    title: t('step_verify', 'Verify Voter Registration'),
    description: t('step_verify_desc', 'Check your name on the electoral roll via the official ECI portal.'),
    link: 'https://voters.eci.gov.in/',
    category: t('registration', 'Registration'),
    icon: '📋',
    actionText: t('open_portal', 'Open Portal'),
    color: 'green',
  },
  {
    id: 2,
    title: t('step_booth', 'Find Your Polling Booth'),
    description: t('step_booth_desc', 'Locate your assigned polling station and plan your route.'),
    category: t('location', 'Location'),
    icon: '📍',
    route: '/map',
    actionText: t('open_map', 'Open Map'),
    color: 'blue',
  },
  {
    id: 3,
    title: t('step_evm', 'Understand the EVM'),
    description: t('step_evm_desc', 'Learn how Electronic Voting Machines work and verify with VVPAT.'),
    category: t('education', 'Education'),
    icon: '🖥️',
    route: '/education',
    actionText: t('start_guide', 'Start Guide'),
    color: 'purple',
  },
  {
    id: 4,
    title: t('step_checklist', 'Election Day Checklist'),
    description: t('step_checklist_desc', 'Review documents and guidelines for a smooth voting day.'),
    category: t('preparation', 'Preparation'),
    icon: '✅',
    route: '/chat',
    actionText: t('ask_ai_assistant', 'Ask AI Assistant'),
    color: 'saffron',
  },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('matpath_completed_steps')
      if (saved) return JSON.parse(saved)

      // If no saved steps, check if user is registered
      const userStr = localStorage.getItem('matpath_user')
      if (userStr) {
        const userData = JSON.parse(userStr)
        if (userData.profile?.voterStatus === 'no') {
          return [] // Not registered, start with 0 steps completed
        }
      }
      return [1] // Default for registered users
    } catch {
      return [1]
    }
  })

  useEffect(() => {
    localStorage.setItem('matpath_completed_steps', JSON.stringify(completedSteps))
  }, [completedSteps])

  const journeySteps = useMemo(() => getJourneySteps(t), [t])
  const progress = Math.round((completedSteps.length / journeySteps.length) * 100)
  const firstName = user?.displayName?.split(' ')[0] || 'Voter'

  const handleToggleStep = (id) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return t('good_morning')
    if (h < 17) return t('good_afternoon')
    return t('good_evening')
  }, [t])

  return (
    <div className="db-page animate-fade-in">
      {/* ═══════ Hero Section ═══════ */}
      <header className="db-hero">
        <div className="db-hero__bg" aria-hidden="true" />
        <div className="db-hero__content">
          <div className="db-hero__text">
            <div className="flex items-center gap-2 mb-3">
              <HandRaisedIcon className="w-5 h-5 text-amber-300" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">{greeting}</p>
            </div>
            <h1 className="db-hero__name">{t('dashboard_greeting', { name: firstName }).replace('Hello, ', '')}</h1>
            <p className="db-hero__subtitle">
              {t('dashboard_subtitle')}
            </p>
          </div>

          {/* Readiness ring */}
          <div className="db-readiness">
            <div className="db-readiness__ring">
              <svg viewBox="0 0 80 80" className="db-readiness__svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="url(#readinessGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                  className="db-readiness__progress"
                />
                <defs>
                  <linearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="db-readiness__value">{progress}%</span>
            </div>
            <div className="db-readiness__label">
              <span className="db-readiness__title">{t('readiness')}</span>
              <span className="db-readiness__desc">{completedSteps.length}/{journeySteps.length} {t('steps')}</span>
            </div>
          </div>
        </div>

        {/* ── Stats row inside hero ── */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div className="db-stat-card__icon-wrap db-stat-card__icon-wrap--amber">
              <ClockIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="db-stat-card__value">{getDaysLeft()}</span>
              <span className="db-stat-card__label">{t('days_left')}</span>
            </div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-card__icon-wrap db-stat-card__icon-wrap--green">
              <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="db-stat-card__value db-stat-card__value--green">{t('verified')}</span>
              <span className="db-stat-card__label">{t('voter_status_label')}</span>
            </div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-card__icon-wrap db-stat-card__icon-wrap--blue">
              <MapPinIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="db-stat-card__value db-stat-card__value--blue">{t('booth_id')}</span>
              <span className="db-stat-card__label">{t('station')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════ Main Content Grid ═══════ */}
      <div className="db-grid">
        {/* ── Left: Voting Journey ── */}
        <section className="db-journey">
          <div className="db-section-header">
            <div>
              <h2 className="db-section-header__title">
                <FireIcon className="w-6 h-6 inline-block mr-2 text-[var(--primary)] -mt-1" />
                {t('voting_journey')}
              </h2>
              <p className="db-section-header__desc">{t('journey_subtitle')}</p>
            </div>
            <span className="db-phase-badge">{t('phase_1')}</span>
          </div>

          <div className="db-steps">
            {journeySteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent =
                !isCompleted &&
                (index === 0 || completedSteps.includes(journeySteps[index - 1].id))

              return (
                <div
                  key={step.id}
                  className={`db-step ${isCompleted ? 'db-step--done' : isCurrent ? 'db-step--active' : 'db-step--pending'}`}
                >
                  {/* Connector */}
                  {index < journeySteps.length - 1 && (
                    <div className={`db-step__connector ${isCompleted ? 'db-step__connector--done' : ''}`} aria-hidden="true" />
                  )}

                  {/* Node */}
                  <div className="db-step__node">
                    {isCompleted ? (
                      <CheckCircleSolid className="db-step__node-icon db-step__node-icon--done" />
                    ) : (
                      <span className="db-step__node-num">{step.id}</span>
                    )}
                    {isCurrent && <div className="db-step__node-pulse" aria-hidden="true" />}
                  </div>

                  {/* Card */}
                  <div className="db-step__card">
                    <div className="db-step__card-top">
                      <span className="db-step__emoji">{step.icon}</span>
                      <div className="db-step__card-meta">
                        <span className="db-step__category">{step.category}</span>
                        <h3 className="db-step__title">{step.title}</h3>
                      </div>
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noreferrer" className="db-step__link" aria-label="Open resource">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="db-step__desc">{step.description}</p>

                    <div className="db-step__actions">
                      {(step.route || step.link) && (
                        <button
                          onClick={() => {
                            if (step.route) navigate(step.route)
                            else if (step.link) window.open(step.link, '_blank')
                          }}
                          className="db-step__action-btn"
                        >
                          {step.actionText}
                          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                      
                      {!isCompleted && isCurrent && (
                        <button
                          onClick={() => handleToggleStep(step.id)}
                          className="db-step__complete-btn"
                        >
                          <CheckCircleSolid className="h-4 w-4" />
                          {t('mark_complete')}
                        </button>
                      )}
                    </div>

                    {isCompleted && (
                      <span className="db-step__done-badge">✓ {t('completed')}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Right: Quick Actions Sidebar ── */}
        <aside className="db-sidebar">
          {/* AI Assistant Card */}
          <div className="db-ai-card">
            <div className="db-ai-card__bg" aria-hidden="true" />
            <div className="db-ai-card__content">
              <div className="db-ai-card__badge">
                <SparklesIcon className="w-3.5 h-3.5" />
                {t('ai_powered')}
              </div>
              <h3 className="db-ai-card__title">{t('ai_assistant_title')}</h3>
              <p className="db-ai-card__desc">
                {t('ai_assistant_desc')}
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="db-ai-card__btn"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                {t('start_conversation')}
              </button>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="db-actions-grid">
            <button
              onClick={() => navigate('/chat')}
              className="db-action-tile"
            >
              <div className="db-action-tile__icon db-action-tile__icon--green">
                <MicrophoneIcon className="h-5 w-5" />
              </div>
              <span className="db-action-tile__label">{t('voice_mode')}</span>
              <span className="db-action-tile__sub">{t('talk_to_ai')}</span>
            </button>

            <button
              onClick={() => navigate('/map')}
              className="db-action-tile"
            >
              <div className="db-action-tile__icon db-action-tile__icon--blue">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <span className="db-action-tile__label">{t('locate_booth')}</span>
              <span className="db-action-tile__sub">{t('find_station')}</span>
            </button>

            <button
              onClick={() => navigate('/education')}
              className="db-action-tile"
              style={{ gridColumn: 'span 2' }}
            >
              <div className="db-action-tile__icon db-action-tile__icon--purple">
                <BookOpenIcon className="h-5 w-5" />
              </div>
              <span className="db-action-tile__label">{t('voting_guide')}</span>
              <span className="db-action-tile__sub">{t('education_subtitle_short')}</span>
            </button>
          </div>

          {/* Timeline link */}
          <button
            onClick={() => navigate('/timeline')}
            className="db-timeline-link"
          >
            <div className="db-timeline-link__icon">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <div className="db-timeline-link__text">
              <span className="db-timeline-link__title">{t('timeline_title')}</span>
              <span className="db-timeline-link__sub">{t('timeline_subtitle')}</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 db-timeline-link__chevron" />
          </button>
        </aside>
      </div>
    </div>
  )
}
