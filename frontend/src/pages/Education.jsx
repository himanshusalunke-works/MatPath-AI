import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, SpeakerWaveIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useVoiceOutput } from '../hooks/useVoiceOutput'

export default function Education() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { speak } = useVoiceOutput()

  const handleListen = (text) => {
    // Strip leading numbers like "0. ", "1. " etc. for cleaner speech
    const cleanText = text.replace(/^\d+\.\s*/, '')
    speak(cleanText)
  }

  const sections = [
    {
      id: 'basics',
      title: t('section_basics_title', 'Voter Essentials'),
      subtitle: t('section_basics_subtitle', 'Important information before you head out'),
      steps: [
        {
          id: 1,
          title: t('step0_title'),
          desc: t('step0_desc'),
          img: '/images/voter_card.png',
          color: 'var(--tertiary)'
        }
      ]
    },
    {
      id: 'election_day',
      title: t('section_election_day_title', 'On Election Day'),
      subtitle: t('section_election_day_subtitle', 'Your step-by-step walkthrough at the booth'),
      steps: [
        {
          id: 2,
          title: t('step1_title'),
          desc: t('step1_desc'),
          img: '/images/verification_step.png',
          color: 'var(--primary)'
        },
        {
          id: 3,
          title: t('step2_title'),
          desc: t('step2_desc'),
          img: '/images/inking_step.png',
          color: '#9333EA'
        }
      ]
    },
    {
      id: 'evm',
      title: t('section_evm_title', 'EVM and VVPAT Guide'),
      subtitle: t('section_evm_subtitle', 'Master the technology of democracy'),
      steps: [
        {
          id: 4,
          title: t('step3_title'),
          desc: t('step3_desc'),
          img: '/images/evm_step.png',
          color: 'var(--secondary)'
        },
        {
          id: 5,
          title: t('step4_title'),
          desc: t('step4_desc'),
          img: '/images/proud_voter.png',
          color: '#DB2777'
        }
      ]
    }
  ]

  return (
    <div className="education-container animate-fade-in pb-20 bg-[var(--background)] min-h-screen">
      {/* Hero Section */}
      <section className="ed-hero ed-hero--education">
        <div className="ed-hero__content">
          <div className="ed-hero__info-wrap">
            <div className="ed-hero__badge">
              <BookOpenIcon className="w-5 h-5" />
              <span>{t('voting_guide', 'Voting Guide')}</span>
            </div>
            <h1 className="ed-hero__title">
              {t('education_title', 'Voter Education Guide')}
            </h1>
            <p className="ed-hero__subtitle">
              {t('education_subtitle', 'A simple step-by-step guide for every citizen')}
            </p>
          </div>

          <div className="ed-hero__stats-card glass-light">
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value">3</span>
              <span className="ed-hero__stat-label">Modules</span>
            </div>
            <div className="ed-hero__stat-divider" aria-hidden="true" />
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value">5</span>
              <span className="ed-hero__stat-label">Critical Steps</span>
            </div>
            <div className="ed-hero__stat-divider" aria-hidden="true" />
            <div className="ed-hero__stat-item">
              <span className="ed-hero__stat-value">100%</span>
              <span className="ed-hero__stat-label">Verified</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        {sections.map((section) => (
          <section key={section.id} className="ed-section">
            <div className="ed-section__header">
              <h2 className="ed-section__title">{section.title}</h2>
              <p className="ed-section__subtitle">{section.subtitle}</p>
            </div>

            
            <div className="space-y-16 mt-12 relative">
              {/* Roadmap connector line (desktop) */}
              <div className="absolute left-[300px] top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden lg:block" />

              {section.steps.map((step) => (
                <div 
                  key={step.id} 
                  className="ed-step__card group"
                >
                  {/* Image Section */}
                  <div className="ed-step__image-wrap" style={{ '--accent': step.color }}>
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="ed-step__image"
                    />
                    <div 
                      className="ed-step__number"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.id}
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="ed-step__content">
                    <div className="ed-step__header">
                      <h2 className="ed-step__title">
                        {step.title}
                      </h2>
                      <button 
                        onClick={() => handleListen(`${step.title}. ${step.desc}`)}
                        className="ed-step__listen-btn"
                        title="Listen to this step"
                      >
                        <SpeakerWaveIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="ed-step__desc">
                      {step.desc}
                    </p>
                    
                    <div className="ed-step__indicator">
                      <div className="ed-step__dot ed-step__dot--active" style={{ '--accent': step.color }}></div>
                      <div className="ed-step__dot ed-step__dot--inactive"></div>
                      <div className="ed-step__dot ed-step__dot--inactive"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Final Call to Action - Premium Redesign */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="ed-cta-card">
          <div className="ed-cta-card__glow" />
          <div className="ed-cta-card__content">
            <h3 className="ed-cta-card__title">
              {t('education_cta_title', 'Ready to make a difference?')}
            </h3>
            <p className="ed-cta-card__desc">
              {t('education_cta_desc', 'Your vote is your voice. Empower yourself with knowledge and lead the change.')}
            </p>
            <div className="ed-cta-card__actions">
              <button 
                onClick={() => navigate('/dashboard')}
                className="ed-cta-card__btn-primary group"
              >
                <span>{t('back_to_command_center', 'Back to Command Center')}</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 inline-block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
