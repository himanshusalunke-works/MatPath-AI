import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import LanguagePicker from '../shared/LanguagePicker'
import logo from '../../assets/logo.png'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  CalendarDaysIcon as CalendarIconSolid,
  MapPinIcon as MapIconSolid,
  BookOpenIcon as BookIconSolid,
} from '@heroicons/react/24/solid'

const NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'home',     label: 'Home',     Icon: HomeIcon,                IconSolid: HomeIconSolid },
  { to: '/chat',      labelKey: 'chat',     label: 'Chat',     Icon: ChatBubbleLeftRightIcon, IconSolid: ChatIconSolid },
  { to: '/timeline',  labelKey: 'timeline', label: 'Timeline', Icon: CalendarDaysIcon,         IconSolid: CalendarIconSolid },
  { to: '/map',       labelKey: 'map',      label: 'Map',      Icon: MapPinIcon,              IconSolid: MapIconSolid },
  { to: '/education', labelKey: 'education_title', label: 'Learn', Icon: BookOpenIcon,        IconSolid: BookIconSolid },
]

/* ═══════════════════════════════════════════
   Bottom Nav — Mobile
   ═══════════════════════════════════════════ */
export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="bn" aria-label="Mobile navigation">
      <div className="bn__inner">
        {NAV_ITEMS.map(({ to, labelKey, label, Icon, IconSolid }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `bn__item ${isActive ? 'bn__item--active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`bn__icon-wrap ${isActive ? 'bn__icon-wrap--active' : ''}`}>
                  {isActive ? <IconSolid className="bn__icon" /> : <Icon className="bn__icon" />}
                </div>
                <span className={`bn__label ${isActive ? 'bn__label--active' : ''}`}>
                  {t(labelKey) || label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════
   Top Header Bar — Always visible (Desktop/Tablet)
   ═══════════════════════════════════════════ */
export function TopBar({ user, onLogout }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="tb" aria-label="Top header">
      <div className="tb__inner">
        {/* Mobile/Tablet Logo (hidden on large screens where sidebar shows logo) */}
        <div className="tb__brand" onClick={() => navigate('/dashboard')}>
          <img src={logo} alt="MatPath AI" className="tb__logo-img" />
          <span className="tb__logo-text">
            MatPath<span className="tb__logo-accent">AI</span>
          </span>
        </div>

        {/* Right side controls */}
        <div className="tb__actions">
          {/* Language Picker */}
          <LanguagePicker />

          {/* Notifications */}
          <button className="tb__btn tb__btn--notify" aria-label="Notifications">
            <BellIcon className="tb__btn-icon" />
            <span className="tb__badge" aria-hidden="true" />
          </button>

          {/* User Section */}
          {user && (
            <div className="tb__user-group">
              <div className="tb__user-avatar">
                {(user.displayName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="tb__user-info">
                <span className="tb__user-name">{user.displayName || 'Voter'}</span>
                <span className="tb__user-role">Active Voter</span>
              </div>
            </div>
          )}

          {/* Logout */}
          <button 
            onClick={onLogout} 
            className="tb__btn tb__btn--logout" 
            aria-label="Sign out"
            title="Sign out"
          >
            <ArrowRightStartOnRectangleIcon className="tb__btn-icon" />
          </button>
        </div>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════
   Sidebar Nav — Desktop (lg+)
   ═══════════════════════════════════════════ */
export function SidebarNav({ user, isCollapsed, onToggle }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <aside
      className={`sb ${isCollapsed ? 'sb--collapsed' : ''}`}
      aria-label="Sidebar navigation"
    >
      {/* ── Collapse Toggle ── */}
      <button
        onClick={onToggle}
        className="sb__toggle"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed
          ? <ChevronRightIcon className="sb__toggle-icon" />
          : <ChevronLeftIcon className="sb__toggle-icon" />
        }
      </button>

      {/* ── Brand ── */}
      <div className="sb__brand" onClick={() => navigate('/dashboard')}>
        <div className="sb__logo-icon">
          <img src={logo} alt="MatPath AI" className="sb__logo-img" />
        </div>
        {!isCollapsed && (
          <div className="sb__logo-text-group">
            <span className="sb__logo-text">
              MatPath<span className="sb__logo-accent">AI</span>
            </span>
            <span className="sb__logo-tagline">Election Guide</span>
          </div>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="sb__nav">
        {NAV_ITEMS.map(({ to, labelKey, label, Icon, IconSolid }) => (
          <NavLink
            key={to}
            to={to}
            title={t(labelKey) || label}
            className={({ isActive }) =>
              `sb__link ${isActive ? 'sb__link--active' : ''} ${isCollapsed ? 'sb__link--collapsed' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`sb__link-icon-wrap ${isActive ? 'sb__link-icon-wrap--active' : ''}`}>
                  {isActive
                    ? <IconSolid className="sb__link-icon" />
                    : <Icon className="sb__link-icon" />
                  }
                </div>
                {!isCollapsed && (
                  <>
                    <span className="sb__link-label">{t(labelKey) || label}</span>
                    {isActive && <div className="sb__link-dot" aria-hidden="true" />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
