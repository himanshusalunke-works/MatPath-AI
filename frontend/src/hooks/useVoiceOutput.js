import { useCallback, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1'

/**
 * useVoiceOutput — Uses Google Cloud TTS via Backend
 * Returns: { playing, speak, stop }
 */
export function useVoiceOutput() {
  const [playing, setPlaying] = useState(false)
  const { i18n } = useTranslation()
  const audioRef = useRef(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
  }, [])

  const speak = useCallback(async (text, languageOverride = null) => {
    stop()

    try {
      setPlaying(true)
      
      const langMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'ta': 'ta-IN'
      }
      const languageCode = languageOverride || langMap[i18n.language] || 'en-IN'

      const response = await fetch(`${API_BASE_URL}/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, languageCode })
      })

      if (!response.ok) throw new Error('TTS request failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.onended = () => {
        setPlaying(false)
        URL.revokeObjectURL(url)
      }
      
      audio.onerror = () => {
        setPlaying(false)
        URL.revokeObjectURL(url)
      }

      await audio.play()
    } catch (error) {
      console.error('Google TTS Error:', error)
      setPlaying(false)
    }
  }, [i18n.language, stop])

  return { playing, speak, stop }
}
