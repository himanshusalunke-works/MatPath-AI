import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, SpeakerWaveIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useVoiceOutput } from '../hooks/useVoiceOutput'

export default function Education() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { speak } = useVoiceOutput()

  const handleListen = (text) => {
    speak(text)
  }

  const steps = [
    {
      id: 1,
      title: t('step0_title'),
      desc: t('step0_desc'),
      img: '/images/voter_card.png',
      color: 'var(--tertiary)'
    },
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
    },
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

  return (
    <div className="education-container animate-fade-in pb-20 bg-[var(--background)] min-h-screen">
      <header className="sticky top-0 z-10 bg-[var(--surface)]/70 backdrop-blur-xl border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4 shadow-sm">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2.5 hover:bg-[var(--background)] rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeftIcon className="w-5 h-5 text-[var(--on-surface-variant)]" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-[var(--on-surface)] flex items-center gap-2 tracking-tight">
            <BookOpenIcon className="w-6 h-6 text-[var(--primary)]" />
            {t('education_title')}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--on-surface-variant)] opacity-60">{t('education_subtitle')}</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {steps.map((step, idx) => (
          <div 
            key={step.id} 
            className="ed-step__card"
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

      {/* Final Call to Action */}
      <div className="max-w-4xl mx-auto px-6 pb-20 mt-8">
        <div className="bg-gradient-to-br from-[var(--tertiary)] to-[#1a4a8d] rounded-[32px] p-10 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1)_0%,transparent_40%)]" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3 tracking-tight">{t('education_cta_title', 'Ready to make a difference?')}</h3>
            <p className="opacity-80 text-lg mb-8 max-w-md mx-auto leading-relaxed">{t('education_cta_desc', 'Your vote is your voice. Empower yourself with knowledge and lead the change.')}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[var(--primary)] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-[0_12px_32px_rgba(164,55,0,0.4)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              {t('back_to_command_center', 'Back to Command Center')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
