import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import PublicNav from '../components/nav/PublicNav'
import { EnvelopeIcon, LockClosedIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const { t } = useTranslation()
  const { login, googleSignIn } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to log in. Please check your credentials.')
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
      setError('Failed to sign in with Google.')
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
          <div className="blob blob-2"></div>
        </div>

        <div className="auth-card glass animate-fade-in">
          <header className="auth-header">
            <h1 className="auth-title">{t('login_title', 'Welcome Back')}</h1>
            <p className="auth-subtitle">{t('login_subtitle', 'Continue your democratic journey')}</p>
          </header>

          {error && <div className="auth-error">{error}</div>}

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleGoogleSignIn}
              className="google-btn"
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>{t('google_signin', 'Sign in with Google')}</span>
            </button>

            <div className="auth-divider">
              <span>{t('or', 'or')}</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link to="#" className="text-[11px] font-bold text-[#FF6B35] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={loading}
              >
                {loading ? t('loading', 'Logging in...') : (
                  <>
                    {t('login_btn', 'Sign In')}
                    <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="auth-footer">
            <p>
              {t('no_account', "Don't have an account?")}{' '}
              <Link to="/signup" className="auth-link">
                {t('signup_link', 'Create Account')}
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
