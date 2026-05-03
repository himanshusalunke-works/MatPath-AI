import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobeAltIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   nativeLabel: 'हिंदी',    flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी',    flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',   nativeLabel: 'தமிழ்',    flag: '🇮🇳' },
]

export default function LanguagePicker({ className = '', variant = 'default' }) {
  const { i18n: i18nInst } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = LANGUAGES.find(l => l.code === i18nInst.language) || LANGUAGES[0]

  const handleChange = (code) => {
    i18nInst.changeLanguage(code)
    localStorage.setItem('matpath_lang', code)
    document.documentElement.lang = code
    setIsOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={`lp ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lp__trigger ${isOpen ? 'lp__trigger--open' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <GlobeAltIcon className="lp__globe" />
        <span className="lp__current">{currentLang.nativeLabel}</span>
        <ChevronDownIcon className={`lp__chevron ${isOpen ? 'lp__chevron--open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lp__dropdown" role="listbox" aria-label="Languages">
          <div className="lp__dropdown-header">
            <GlobeAltIcon className="lp__dropdown-header-icon" />
            <span>Language</span>
          </div>
          <div className="lp__options">
            {LANGUAGES.map((lang) => {
              const active = i18nInst.language === lang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => handleChange(lang.code)}
                  className={`lp__option ${active ? 'lp__option--active' : ''}`}
                  role="option"
                  aria-selected={active}
                >
                  <span className="lp__option-flag">{lang.flag}</span>
                  <span className="lp__option-info">
                    <span className="lp__option-native">{lang.nativeLabel}</span>
                    <span className="lp__option-label">{lang.label}</span>
                  </span>
                  {active && (
                    <CheckIcon className="lp__option-check" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { LANGUAGES }
