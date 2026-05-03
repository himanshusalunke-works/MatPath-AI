import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import PublicNav from '../components/nav/PublicNav'
import heroImg from '../assets/hero.png'
import {
  ShieldCheckIcon,
  GlobeAsiaAustraliaIcon,
  ChatBubbleBottomCenterTextIcon,
  MapIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Typewriter effect state
  const phrases = [
    t('typewriter_1'),
    t('typewriter_2'),
    t('typewriter_3'),
    t('typewriter_4')
  ]
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

  // Typewriter logic
  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000)
      return
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, Math.max(reverse ? 75 : subIndex === phrases[index].length ? 1000 : 150, Math.random() * 200))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, phrases])

  return (
    <div className="landing-v2">
      <PublicNav />

      {/* Hero Section */}
      <section className="hero-v2">
        <div className="hero-v2__container">
          <div className="hero-v2__content animate-fade-in">
            <div className="hero-badge animate-fade-in-up">
              <span className="hero-badge__dot"></span>
              {t('ai_intelligence')}
            </div>
            <h1 className="hero-v2__title">
              {t('hero_title_part1')} <br />
              <span className="text-gradient-hero">
                {phrases[index].substring(0, subIndex)}
                <span className="cursor">|</span>
              </span>
            </h1>
            <p className="hero-v2__desc">
              {t('hero_desc')}
            </p>
            
            <div className="hero-v2__actions">
              <button onClick={() => navigate('/signup')} className="btn-hero-primary">
                {t('get_started')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <Link to="/login" className="btn-hero-secondary">
                {t('already_have_account', 'I have an account')}
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat__val">98%</span>
                <span className="hero-stat__label">{t('hero_stat_accuracy')}</span>
              </div>
              <div className="hero-stat-sep"></div>
              <div className="hero-stat">
                <span className="hero-stat__val">12+</span>
                <span className="hero-stat__label">{t('hero_stat_languages')}</span>
              </div>
              <div className="hero-stat-sep"></div>
              <div className="hero-stat">
                <span className="hero-stat__val">24/7</span>
                <span className="hero-stat__label">{t('hero_stat_support')}</span>
              </div>
            </div>
          </div>

          <div className="hero-v2__visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="visual-container">
              <img src={heroImg} alt="Hero" className="visual-main-img" />
              <div className="visual-overlay"></div>
              
              {/* Floating elements */}
              <div className="floating-widget widget-ai glass animate-float">
                <div className="widget-icon bg-[var(--primary-gradient)] shadow-[0_4px_12px_rgba(255,107,53,0.3)]">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-white" />
                </div>
                <div className="widget-body">
                  <p className="widget-title">AI Assistant</p>
                  <p className="widget-text">Real-time voting guide</p>
                </div>
              </div>

              <div className="floating-widget widget-map glass animate-float-delayed">
                <div className="widget-icon bg-[var(--tertiary-gradient)] shadow-[0_4px_12px_rgba(26,74,141,0.3)]">
                  <MapIcon className="w-5 h-5 text-white" />
                </div>
                <div className="widget-body">
                  <p className="widget-title">Booth Locator</p>
                  <p className="widget-text">Find your polling station</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-v2">
        <div className="features-v2__grid">
          <div className="feature-v2-card animate-fade-in-up">
            <div className="feature-v2-card__icon"><CheckCircleIcon /></div>
            <h3>{t('feature_journey_title')}</h3>
            <p>{t('feature_journey_desc')}</p>
          </div>
          <div className="feature-v2-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="feature-v2-card__icon"><ChatBubbleBottomCenterTextIcon /></div>
            <h3>{t('feature_ai_title')}</h3>
            <p>{t('feature_ai_desc')}</p>
          </div>
          <div className="feature-v2-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="feature-v2-card__icon"><CalendarIcon /></div>
            <h3>{t('feature_timeline_title')}</h3>
            <p>{t('feature_timeline_desc')}</p>
          </div>
          <div className="feature-v2-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="feature-v2-card__icon"><MapIcon /></div>
            <h3>{t('feature_booth_title')}</h3>
            <p>{t('feature_booth_desc')}</p>
          </div>
        </div>
      </section>

      <footer className="footer-v2">
        <div className="footer-v2__inner">
          <p>© 2026 {t('footer_text')}</p>
        </div>
      </footer>
    </div>
  )
}
