import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ProgressBar from '../components/shared/ProgressBar'

const VOTER_OPTIONS = [
  { value: 'yes', labelKey: 'voter_yes' },
  { value: 'no', labelKey: 'voter_no' },
]

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const totalSteps = 3
  const [form, setForm] = useState({
    dob: '',
    state: '',
    district: '',
    parliamentaryConstituency: '',
    assemblyConstituency: '',
    voterStatus: '',
    epicId: '',
  })
  const [errors, setErrors] = useState({})

  const [statesData, setStatesData] = useState([])
  const [districtsList, setDistrictsList] = useState([])
  const [parliamentaryList, setParliamentaryList] = useState([])
  const [assemblyList, setAssemblyList] = useState([])

  useEffect(() => {
    const userStr = localStorage.getItem('matpath_user')
    if (userStr) {
      const userData = JSON.parse(userStr)
      if (userData.profile) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate])

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await api.get('/locations')
        const data = response.data
        setStatesData(data.states || [])
      } catch (err) {
        console.error('Failed to fetch location data:', err)
      }
    }
    fetchLocationData()
  }, [])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleStateChange = (e) => {
    const newState = e.target.value
    setForm((prev) => ({ ...prev, state: newState, district: '', parliamentaryConstituency: '', assemblyConstituency: '' }))
    setErrors((prev) => ({ ...prev, state: '', district: '', parliamentaryConstituency: '', assemblyConstituency: '' }))
    
    const stateObj = statesData.find(s => s.state === newState)
    setDistrictsList(stateObj ? stateObj.districts || [] : [])
    setParliamentaryList([])
    setAssemblyList([])
  }

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value
    setForm((prev) => ({ ...prev, district: newDistrict, parliamentaryConstituency: '', assemblyConstituency: '' }))
    setErrors((prev) => ({ ...prev, district: '', parliamentaryConstituency: '', assemblyConstituency: '' }))
    
    const distObj = districtsList.find(d => d.district === newDistrict)
    setParliamentaryList(distObj ? distObj.parliamentaryConstituencies || [] : [])
    setAssemblyList([])
  }

  const handleParliamentaryChange = (e) => {
    const newPc = e.target.value
    setForm((prev) => ({ ...prev, parliamentaryConstituency: newPc, assemblyConstituency: '' }))
    setErrors((prev) => ({ ...prev, parliamentaryConstituency: '', assemblyConstituency: '' }))
    
    const pcObj = parliamentaryList.find(p => p.pc === newPc)
    setAssemblyList(pcObj ? pcObj.assemblyConstituencies || [] : [])
  }

  const validateStep = () => {
    const newErrors = {}
    if (step === 1) {
      if (!form.dob) {
        newErrors.dob = 'Please enter your Date of Birth'
      } else {
        const today = new Date()
        const birthDate = new Date(form.dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        if (age < 18) {
          newErrors.dob = 'You must be at least 18 years old to proceed.'
        }
      }
    }
    if (step === 2) {
      if (!form.state) newErrors.state = 'Please select your state'
      if (!form.district) newErrors.district = 'Please select your district'
      if (!form.parliamentaryConstituency) newErrors.parliamentaryConstituency = 'Please select your parliamentary constituency'
      if (!form.assemblyConstituency) newErrors.assemblyConstituency = 'Please select your assembly constituency'
    }
    if (step === 3) {
      if (!form.voterStatus) newErrors.voterStatus = 'Please select an option'
      if (form.voterStatus === 'yes') {
        if (!form.epicId?.trim()) {
          newErrors.epicId = 'Please enter your EPIC ID'
        } else if (form.epicId.length < 10) {
          newErrors.epicId = 'EPIC ID must be at least 10 characters'
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateStep()) return
    if (step < totalSteps) {
      setStep(step + 1)
      } else {
      try {
        // Calculate age from dob
        const today = new Date()
        const birthDate = new Date(form.dob)
        let calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }

        const submissionData = {
          ...form,
          age: calculatedAge
        }

        // Save profile to backend
        await api.post('/user/profile', submissionData)
        
        // Update local storage
        const user = JSON.parse(localStorage.getItem('matpath_user') || '{}')
        user.profile = submissionData
        localStorage.setItem('matpath_user', JSON.stringify(user))

        // Set initial completed steps based on registration status
        if (form.voterStatus === 'no') {
          localStorage.setItem('matpath_completed_steps', JSON.stringify([]))
        } else {
          localStorage.setItem('matpath_completed_steps', JSON.stringify([1]))
        }
        
        navigate('/dashboard')
      } catch (err) {
        console.error('Failed to save profile:', err)
        alert('Failed to save profile. Please try again.')
      }
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container animate-fade-in">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-step-label">
            <span className="onboarding-step-label__emoji" aria-hidden="true">📝</span>
            <span>
              {t('step')} {step} {t('of')} {totalSteps}: {t('profile_setup')}
            </span>
          </div>
          <ProgressBar value={step} max={totalSteps} />
        </div>

        {/* Step content */}
        <div className="onboarding-body" style={{ minHeight: '320px' }}>
          {step === 1 && (
            <div className="onboarding-step animate-fade-in-up" key="step1">
              <h2 className="onboarding-step__title">👋 {t('profile_setup')}</h2>
              <p className="onboarding-step__subtitle">
                We need a few details to personalize your election journey.
              </p>
              <div className="onboarding-field">
                <label htmlFor="dob-input" className="onboarding-field__label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob-input"
                  max={new Date().toISOString().split("T")[0]}
                  value={form.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className={`onboarding-input ${errors.dob ? 'onboarding-input--error' : ''}`}
                  aria-invalid={!!errors.dob}
                  aria-describedby={errors.dob ? 'dob-error' : undefined}
                />
                {errors.dob && (
                  <p id="dob-error" className="onboarding-error" role="alert">{errors.dob}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step animate-fade-in-up" key="step2">
              <h2 className="onboarding-step__title">📍 Location Details</h2>
              <p className="onboarding-step__subtitle">
                This helps us find your polling booth and local timeline.
              </p>
              <div className="onboarding-field">
                <label htmlFor="state-select" className="onboarding-field__label">
                  {t('your_state')}
                </label>
                <select
                  id="state-select"
                  value={form.state}
                  onChange={handleStateChange}
                  className={`onboarding-input onboarding-select ${errors.state ? 'onboarding-input--error' : ''}`}
                  aria-invalid={!!errors.state}
                >
                  <option value="">Select your state</option>
                  {statesData.map((s) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="onboarding-error" role="alert">{errors.state}</p>
                )}
              </div>
              <div className="onboarding-field">
                <label htmlFor="district-select" className="onboarding-field__label">
                  {t('your_district')}
                </label>
                <select
                  id="district-select"
                  value={form.district}
                  onChange={handleDistrictChange}
                  className={`onboarding-input onboarding-select ${errors.district ? 'onboarding-input--error' : ''}`}
                  aria-invalid={!!errors.district}
                  disabled={!form.state}
                >
                  <option value="">Select your district</option>
                  {districtsList.map((d) => (
                    <option key={d.district} value={d.district}>{d.district}</option>
                  ))}
                </select>
                {errors.district && (
                  <p className="onboarding-error" role="alert">{errors.district}</p>
                )}
              </div>
              <div className="onboarding-field">
                <label htmlFor="parliamentary-select" className="onboarding-field__label">
                  Parliamentary Constituency
                </label>
                <select
                  id="parliamentary-select"
                  value={form.parliamentaryConstituency}
                  onChange={handleParliamentaryChange}
                  className={`onboarding-input onboarding-select ${errors.parliamentaryConstituency ? 'onboarding-input--error' : ''}`}
                  aria-invalid={!!errors.parliamentaryConstituency}
                  disabled={!form.district}
                >
                  <option value="">Select Parliamentary Constituency</option>
                  {parliamentaryList.map((p) => (
                    <option key={p.pc} value={p.pc}>{p.pc}</option>
                  ))}
                </select>
                {errors.parliamentaryConstituency && (
                  <p className="onboarding-error" role="alert">{errors.parliamentaryConstituency}</p>
                )}
              </div>
              <div className="onboarding-field">
                <label htmlFor="assembly-select" className="onboarding-field__label">
                  Assembly Constituency
                </label>
                <select
                  id="assembly-select"
                  value={form.assemblyConstituency}
                  onChange={(e) => updateField('assemblyConstituency', e.target.value)}
                  className={`onboarding-input onboarding-select ${errors.assemblyConstituency ? 'onboarding-input--error' : ''}`}
                  aria-invalid={!!errors.assemblyConstituency}
                  disabled={!form.parliamentaryConstituency}
                >
                  <option value="">Select Assembly Constituency</option>
                  {assemblyList.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {errors.assemblyConstituency && (
                  <p className="onboarding-error" role="alert">{errors.assemblyConstituency}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step animate-fade-in-up" key="step3">
              <h2 className="onboarding-step__title">🗳️ Voter Status</h2>
              <p className="onboarding-step__subtitle">
                This determines which steps we include in your journey.
              </p>
              <div className="onboarding-field">
                <p className="onboarding-field__label">{t('voter_status')}</p>
                <div className="onboarding-voter-options">
                  {VOTER_OPTIONS.map(({ value, labelKey }) => (
                    <button
                      key={value}
                      type="button"
                      id={`voter-${value}`}
                      onClick={() => updateField('voterStatus', value)}
                      aria-pressed={form.voterStatus === value}
                      className={`onboarding-voter-btn ${
                        form.voterStatus === value ? 'onboarding-voter-btn--active' : ''
                      }`}
                    >
                      {value === 'yes' && '✅ '}
                      {value === 'no' && '❌ '}
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
                {errors.voterStatus && (
                  <p className="onboarding-error" role="alert">{errors.voterStatus}</p>
                )}
              </div>

              {form.voterStatus === 'yes' && (
                <div className="onboarding-field animate-fade-in-up" style={{ marginTop: '1.5rem' }}>
                  <label htmlFor="epic-input" className="onboarding-field__label">
                    EPIC ID (Voter ID Number)
                  </label>
                  <input
                    type="text"
                    id="epic-input"
                    placeholder="e.g. ABC1234567"
                    value={form.epicId}
                    onChange={(e) => updateField('epicId', e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())}
                    className={`onboarding-input ${errors.epicId ? 'onboarding-input--error' : ''}`}
                    aria-invalid={!!errors.epicId}
                  />
                  {errors.epicId && (
                    <p className="onboarding-error" role="alert">{errors.epicId}</p>
                  )}
                </div>
              )}

              {form.voterStatus === 'no' && (
                <div className="onboarding-field animate-fade-in-up" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <h3 style={{ color: '#eab308', fontWeight: 600, marginBottom: '0.5rem' }}>Registration Journey Setup</h3>
                  <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.75rem' }}>
                    Don't worry! We'll guide you step-by-step through the official Election Commission of India registration process once you continue.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="onboarding-actions">
          {step > 1 && (
            <button
              id="onboarding-back"
              onClick={handleBack}
              className="onboarding-btn onboarding-btn--back"
            >
              ← {t('back')}
            </button>
          )}
          <button
            id="onboarding-next"
            onClick={handleNext}
            className="onboarding-btn onboarding-btn--next"
          >
            {step === totalSteps ? (form.voterStatus === 'no' ? '🚀 Start Registration Journey' : '🚀 Start My Journey') : `${t('next')} →`}
          </button>
        </div>
      </div>
    </div>
  )
}
