import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import PublicNav from '../components/nav/PublicNav'
import { EnvelopeIcon, LockClosedIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/outline'

export default function Signup() {
  const { t } = useTranslation()
  const { signup, googleSignIn } = useAuth()
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await signup(email, password, name)
      navigate('/onboarding')
    } catch (err) {
      setError('Failed to create an account. Email might already be in use.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      const result = await googleSignIn()
      const { getAdditionalUserInfo } = await import('firebase/auth')
      const details = getAdditionalUserInfo(result)
      if (details?.isNewUser) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to sign up with Google.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <PublicNav minimal transparent />
      
      <main className="auth-container">
        <div className="auth-visual-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="auth-card glass animate-fade-in">
          <header className="auth-header">
            <h1 className="auth-title">{t('signup_title', 'Join MatPath AI')}</h1>
            <p className="auth-subtitle">{t('signup_subtitle', 'Start your personalized election journey')}</p>
          </header>

          {error && <div className="auth-error">{error}</div>}

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleGoogleSignIn}
              className="google-btn"
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>{t('google_signup', 'Sign up with Google')}</span>
            </button>

            <div className="auth-divider">
              <span>{t('or', 'or')}</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="name">{t('full_name', 'Full Name')}</label>
                <div className="auth-input-wrapper">
                  <UserIcon className="auth-icon" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="email">{t('email', 'Email Address')}</label>
                <div className="auth-input-wrapper">
                  <EnvelopeIcon className="auth-icon" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voter@example.com"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="password">{t('password', 'Password')}</label>
                <div className="auth-input-wrapper">
                  <LockClosedIcon className="auth-icon" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    minLength={6}
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-tight text-center">
                By signing up, you agree to our <Link to="#" className="text-[#FF6B35] font-bold">Terms</Link> and <Link to="#" className="text-[#FF6B35] font-bold">Privacy</Link>.
              </p>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={loading}
              >
                {loading ? t('loading', 'Creating Account...') : (
                  <>
                    {t('signup_btn', 'Create Account')}
                    <UserPlusIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="auth-footer">
            <p>
              {t('already_have_account', 'Already have an account?')}{' '}
              <Link to="/login" className="auth-link">
                {t('login_link', 'Sign In')}
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
