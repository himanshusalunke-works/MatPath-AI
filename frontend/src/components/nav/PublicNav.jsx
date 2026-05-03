import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguagePicker from '../shared/LanguagePicker'
import logo from '../../assets/logo.png'

export default function PublicNav({ minimal = false, transparent = false }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <nav className={`landing-nav ${transparent ? 'nav-transparent' : 'glass'} ${minimal ? 'nav-minimal' : ''}`}>
      <div className="landing-nav__inner">
        <div className="landing-nav__logo" onClick={() => navigate('/')}>
          <div className="logo-container">
            <img src={logo} alt="MatPath AI" className="logo-img-large" />
            <div className="logo-text-wrapper">
              <span className="logo-text-main">MatPath</span>
              <span className="logo-text-accent">AI</span>
            </div>
          </div>
        </div>
        
        <div className="landing-nav__right">
          <div className="nav-lang-wrapper">
            <LanguagePicker />
          </div>
          
          {!minimal && (
            <div className="flex items-center gap-6">
              <Link to="/login" className="nav-login-link">
                {t('sign_in')}
              </Link>
              <Link to="/signup" className="nav-signup-btn">
                {t('get_started')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
